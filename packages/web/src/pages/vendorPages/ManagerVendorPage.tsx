import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";
import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import { UserContext } from "@feria-a-ti/web/src/App";
import "../../App.css";

function VendorLoginPage() {
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Router dom
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
        console.log("SUBMIT FORM");
        setAttempt(attempt + 1);
        const formatedData: LoginFields = {
            email: data.email as string,
            password: data.password as string,
            attempts: attempt,
        };
        const check = checkLoginFields(formatedData);
        if (check) {
            setSubmitActive(false);
            const login = httpsCallable(functions, "loginVendor");
            login(formatedData)
                .then((result) => {
                    const {
                        msg,
                        extra: { token, email, type },
                    } = result.data as ResponseData<UserToken>;
                    localStorage.setItem("token", token);
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setAlertMessage(msg);
                    }
                    if (token != null && token !== "") {
                        setSession && setSession({ token, type, email });
                        navigate("/session");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
            {type !== "vendor" && <Navigate to="/session" replace={true} />}
            <ProductList label="" onSubmit={onSubmit} />
            <ProductAddForm onSubmit={onSubmit} canSubmit={canSubmit} />
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
