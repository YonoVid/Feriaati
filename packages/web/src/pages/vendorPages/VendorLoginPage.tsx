import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { Link } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

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
        const check = checkLoginFields(formatedData);
        if (check) {
            //Lock button
            setCanSubmit(false);
            const login = httpsCallable(functions, "loginVendor");
            login(formatedData)
                .then((result) => {
                    const {
                        msg,
                        error,
                        extra: { token, email, type },
                    } = result.data as ResponseData<UserToken>;
                    localStorage.setItem("token", token);
                    console.log(result);
                    console.log(attempt);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                    if (token != null && token !== "") {
                        setSession && setSession({ token, type, email });
                        navigate("/session");
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };
    return (
        <>
            {type === "vendor" && <Navigate to="/session" replace={true} />}
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
                    No tienes una cuenta? Registrate
                </Link>
                <br />
                <Link
                    component="button"
                    onClick={() => navigate("/recoveryVendor")}
                >
                    Olvidaste tu contraseña?
                </Link>
            </LoginForm>
        </>
    );
}
export default VendorLoginPage;
