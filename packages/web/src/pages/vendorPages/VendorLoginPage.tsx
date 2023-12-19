import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "@mui/material";

import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import { loginVendor } from "@feria-a-ti/common/functions/accessFunctions";

import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function VendorLoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Router dom
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        setAttempt(attempt + 1);
        const formatedData: LoginFields = {
            email: data.email as string,
            password: data.password as string,
            attempts: attempt,
        };
        console.log(formatedData);

        loginVendor(
            { formatedData, setCanSubmit, setMessage },
            (value: UserToken) => {
                setSession && setSession(value);
                navigate("/session");
            }
        );
    };
    return (
        <>
            {(type === userType.vendor || type === userType.contributor) && (
                <Navigate to="/session" replace={true} />
            )}
            <LoginForm
                label="Iniciar sesión de vendedor"
                color="secondary"
                onSubmit={onSubmit}
                canSubmit={canSubmit}
            >
                <Link
                    component="button"
                    onClick={() => navigate("/registerVendor")}
                >
                    ¿No tienes una cuenta? Regístrate
                </Link>
                <br />
                <Link
                    component="button"
                    onClick={() => navigate("/recoveryVendor")}
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </LoginForm>
        </>
    );
}
export default VendorLoginPage;
