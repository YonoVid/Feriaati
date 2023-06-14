import React, { createContext, useContext, useState } from "react";
import {
    SessionUserData,
    UIMessages,
} from "@feria-a-ti/common/model/sessionType";

import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import {
    getSessionEmail,
    getSessionToken,
    getSessionType,
    setSession,
    resetSession,
    getSession,
} from "../utilities/sessionData";
import { MessageAlert } from "../components/MessageAlert";

export const ComponentContext = createContext<SessionUserData & UIMessages>({
    authUser: "",
    authToken: "",
    type: userType.undefined,
    setSession: (data: UserToken) => {
        data;
    },
    resetSession: () => false,
    checkSession: () => false,
    setMessage: () => false,
});

export const AppContext = (props: { children: any }) => {
    const [user, setUser] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [type, setType] = useState<userType>(userType.undefined);

    getSession().then((value) => {
        setUser(value.email);
        setToken(value.token);
        setType(value.type);
    });

    const setSessionData = (user: UserToken) => {
        setUser(user.email);
        setToken(user.token);
        setType(user.type);
        setSession(user);
    };

    const resetSessionData = () => {
        setUser("");
        setToken("");
        setType(userType.undefined);
        resetSession();
    };

    const checkSessionData = (): boolean => {
        if (user === "" || token === "" || type === userType.undefined) {
            resetSessionData();
            return false;
        }
        return true;
    };

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("ERROR");
    const closeAlert = () => {
        setShowAlert(false);
    };

    const setMessage = (data: { msg: string; isError: boolean }) => {
        setAlertMessage(data.msg);
        // setSnackBarType(data.isError ? "error" : "success");
        setShowAlert(true);
    };

    return (
        <>
            <ComponentContext.Provider
                value={{
                    authUser: user,
                    authToken: token,
                    type,
                    setSession: setSessionData,
                    resetSession: resetSessionData,
                    checkSession: checkSessionData,
                    setMessage: setMessage,
                }}
            >
                {props.children}
            </ComponentContext.Provider>
            <MessageAlert
                open={showAlert}
                title={"ESTADO DE ACCIÓN"}
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
};

export const useAppContext = () =>
    useContext<SessionUserData & UIMessages>(ComponentContext);
