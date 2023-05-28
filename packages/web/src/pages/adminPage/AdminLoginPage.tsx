import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import LoginForm from "@feria-a-ti/web/src/components/loginForm/LoginForm";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import { UserContext } from "@feria-a-ti/web/src/App";
import "../../App.css";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { setupLogin } from "../../functions/utilities";

function AdminLoginPage() {
    //Global state variable
    const { setAuthToken, setAuthUser, setType, type } =
        useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    // Form related variables
    const [canSubmit, setSubmitActive] = useState(true);
    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        setSubmitActive(true);
        setShowAlert(false);
    };
    const onSubmit = (data: FieldValues) => {
        setSubmitActive(false);
        console.log("SUBMIT FORM");
        setAttempt(attempt + 1);
        const formatedData: LoginFields = {
            email: data.email as string,
            password: data.password as string,
            attempts: attempt,
        };
        const check = checkLoginFields(formatedData);
        if (check) {
            const login = httpsCallable(functions, "adminLogin");
            login(formatedData)
                .then((result) => {
                    const {
                        msg,
                        extra: { token, type },
                    } = result.data as ResponseData<UserToken>;
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setAlertMessage(msg);
                    }
                    console.log("TOKEN::", token);
                    if (token && token !== "") {
                        setupLogin({ email: data.email, token, type });
                        setAuthUser && setAuthUser(data.email);
                        setAuthToken && setAuthToken(token);
                        setType && setType(type);
                        navigate("/admin");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
            {type === "admin" && <Navigate to="/admin" replace={true} />}
            <LoginForm
                label="Acceso de administración"
                onSubmit={onSubmit}
                canSubmit={canSubmit}
            />
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}
export default AdminLoginPage;
