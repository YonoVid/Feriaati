import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import { Link } from "@mui/material";
import { UserToken } from "@feria-a-ti/common/model/functionsTypes";
import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";

import { loginBuyer } from "@feria-a-ti/common/functions/accessFunctions";

import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function LoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    // Form variables
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: FieldValues) => {
        setCanSubmit(false);
        console.log("SUBMIT FORM");
        setAttempt(attempt + 1);
        const formatedData: LoginFields = {
            email: data.email as string,
            password: data.password as string,
            attempts: attempt,
        };

        loginBuyer(
            { formatedData, setCanSubmit, setMessage },
            (value: UserToken) => {
                setSession && setSession(value);
                navigate("/session");
            }
        );
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
                    ¿No tienes una cuenta? Regístrate
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
