import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { Link } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import LoginForm from "@feria-a-ti/web/src/components/loginForm/LoginForm";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";

import "../../App.css";

function VendorLoginPage() {
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState(0);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
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
            const login = httpsCallable(functions, "loginVendor");
            login(formatedData)
                .then((result) => {
                    const { msg, token } = result.data as any;
                    localStorage.setItem("token", token);
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setAlertMessage(msg);
                    }
                    if (token !== "") {
                        navigate("/session");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
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
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}
export default VendorLoginPage;
