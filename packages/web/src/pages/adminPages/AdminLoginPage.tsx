import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import { UserToken } from "@feria-a-ti/common/model/functionsTypes";

import { loginAdmin } from "@feria-a-ti/common/functions/accessFunctions";

import LoginForm from "@feria-a-ti/web/src/components/forms/loginForm/LoginForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function AdminLoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();

    //Global state variable
    const { setSession, type } = useContext(UserContext);

    //Navigation definition
    const navigate = useNavigate();

    // Form related variables
    const [canSubmit, setCanSubmit] = useState(true);
    const [attempt, setAttempt] = useState(0);

    //ON SUBMIT Action
    const onSubmit = (data: FieldValues) => {
        setCanSubmit(false);
        console.log("SUBMIT FORM");
        setAttempt(attempt + 1);
        const formatedData: LoginFields = {
            email: data.email as string,
            password: data.password as string,
            attempts: attempt,
        };

        loginAdmin(
            { formatedData, setCanSubmit, setMessage },
            (value: UserToken) => {
                setSession && setSession(value);
                navigate("/admin");
            }
        );
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
