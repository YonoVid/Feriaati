import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { Link } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";

import LoginForm from "@feria-a-ti/web/src/components/loginForm/LoginForm";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import { UserContext } from "@feria-a-ti/web/src/App";

import "../../App.css";

function LoginPage() {
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    // Form variables
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
            const login = httpsCallable(functions, "login");
            login(formatedData)
                .then((result) => {
                    const {
                        msg,
                        extra: { email, type, token },
                    } = result.data as ResponseData<UserToken>;
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setAlertMessage(msg);
                    }
                    if (token != null && token !== "") {
                        setSession && setSession({ email, type, token });
                        navigate("/session");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
            {type === "user" && <Navigate to="/session" replace={true} />}
            <LoginForm
                label="Iniciar sesión"
                onSubmit={onSubmit}
                canSubmit={canSubmit}
            >
                <Link component="button" onClick={() => navigate("/register")}>
                    ¿No tienes una cuenta? Registrate
                </Link>
                <br />
                <Link component="button" onClick={() => navigate("/recovery")}>
                    ¿Olvidaste tu contraseña?
                </Link>
            </LoginForm>
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}
export default LoginPage;
