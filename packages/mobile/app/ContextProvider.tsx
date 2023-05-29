import React, { createContext, useState } from "react";
import { SessionUserData } from "@feria-a-ti/common/model/sessionType";

import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import {
    getSessionEmail,
    getSessionToken,
    getSessionType,
} from "../utilities/sessionData";

export const ComponentContext = createContext<SessionUserData>({
    authUser: "",
    authToken: "",
    type: userType.undefined,
    setSession: (data: UserToken) => {
        data;
    },
    resetSession: () => false,
    checkSession: () => false,
});

export const ContextProvider = (props: { children: any }) => {
    const [user, setUser] = useState<string>("");
    getSessionEmail().then((data) => setUser(data));
    const [token, setToken] = useState<string>("");
    getSessionToken().then((data) => setToken(data));
    const [type, setType] = useState<userType>();
    getSessionType().then((data) => setType(data));

    const setSessionData = (user: UserToken) => {
        setUser(user.email);
        setToken(user.token);
        setType(user.type);
        setSessionData(user);
    };

    const resetSessionData = () => {
        setUser("");
        setToken("");
        setType(userType.undefined);
        resetSessionData();
    };

    const checkSessionData = (): boolean => {
        if (user === "" || token === "" || type === userType.undefined) {
            checkSessionData();
            return false;
        }
        return true;
    };

    return (
        <ComponentContext.Provider
            value={{
                authUser: user,
                authToken: token,
                type,
                setSession: setSessionData,
                resetSession: resetSessionData,
                checkSession: checkSessionData,
            }}
        >
            {props.children}
        </ComponentContext.Provider>
    );
};
