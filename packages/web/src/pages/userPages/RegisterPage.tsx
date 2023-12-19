import { FieldValues } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { Link } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase";
import {
    RegisterConfirm,
    RegisterFields,
    userStatus,
} from "@feria-a-ti/common/model/fields/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { messagesCode } from "@feria-a-ti/common/constants/errors";

import {
    confirmRegisterUser,
    registerAccountUser,
} from "@feria-a-ti/common/functions/account/registerFunctions";

import RegisterUserForm from "@feria-a-ti/web/src/components/forms/registerUserForm/RegisterUserForm";
import ConfirmRegisterForm from "@feria-a-ti/web/src/components/forms/confirmRegisterForm/ConfirmRegisterForm";

import { useHeaderContext } from "../HeaderFunction";

function RegisterPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    // Dom redirection variable
    const navigate = useNavigate();
    // Action to do on sucesfull form submit
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canSubmit, setCanSubmit] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

    const onSubmitRegister = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: RegisterFields = {
            username: data.username as string,
            email: data.email as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
            status: userStatus.registered,
        };

        registerAccountUser(
            { formatedData, setCanSubmit, setMessage },
            (value: string) => {
                //Set registered email
                setEmailRegistered(value);
                //Set register complete
                setRegisterComplete(true);
            }
        );
    };

    const onSubmitConfirmRegister = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RegisterConfirm = {
            email: emailRegistered as string,
            code: data.code as string,
        };

        if (registerComplete) {
            confirmRegisterUser(
                { formatedData, setCanSubmit, setMessage },
                () => {
                    navigate("/login");
                }
            );
        }
    };

    return (
        <>
            {(registerComplete && (
                <ConfirmRegisterForm
                    onSubmit={onSubmitConfirmRegister}
                    canSubmit={canSubmit}
                />
            )) || (
                <RegisterUserForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canSubmit}
                >
                    <Link component="button" onClick={() => navigate("/login")}>
                        Ya tengo una cuenta
                    </Link>
                </RegisterUserForm>
            )}
        </>
    );
}

export default RegisterPage;
