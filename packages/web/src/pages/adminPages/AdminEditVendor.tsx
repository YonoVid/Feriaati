import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import "../../App.css";

function AdminLoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Form related variables
    const [canSubmit, setSubmitActive] = useState(true);
    const [attempt, setAttempt] = useState(0);
    //ON SUBMIT Action
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
                        error,
                        extra: { id, email, token, type },
                    } = result.data as ResponseData<UserToken>;
                    console.log(result);
                    console.log(attempt);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                    console.log("TOKEN::", token);
                    if (token != null && token !== "") {
                        setSession && setSession({ id, token, type, email });
                        navigate("/admin");
                    }
                })
                .finally(() => setSubmitActive(true));
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
        </>
    );
}
export default AdminLoginPage;
