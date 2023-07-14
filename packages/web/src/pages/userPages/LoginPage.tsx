import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { Link } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";

import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

function LoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    // Form variables
    const [canSubmit, setSubmitActive] = useState(true);

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
                        error,
                        extra: { email, type, token, id },
                    } = result.data as ResponseData<UserToken>;
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                    if (token != null && token !== "") {
                        setSession && setSession({ email, type, token, id });
                        navigate("/session");
                    }
                })
                .finally(() => setSubmitActive(true));
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
        </>
    );
}
export default LoginPage;
