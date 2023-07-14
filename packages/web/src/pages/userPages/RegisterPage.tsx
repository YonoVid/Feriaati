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
import { checkRegisterFields } from "@feria-a-ti/common/check/checkRegisterFields";
import RegisterUserForm from "@feria-a-ti/web/src/components/forms/registerUserForm/RegisterUserForm";
import ConfirmRegisterForm from "@feria-a-ti/web/src/components/forms/confirmRegisterForm/ConfirmRegisterForm";

import { useHeaderContext } from "../HeaderLayout";

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
        const check = checkRegisterFields(formatedData);

        console.log("ERROR CHECK::", check);

        if (check) {
            //Lock register button
            setCanSubmit(false);
            //Call firebase function to create user
            const addUser = httpsCallable<RegisterFields, ResponseData<string>>(
                functions,
                "addUser"
            );
            addUser(formatedData)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    if (!error) {
                        //Set registered email
                        setEmailRegistered(data.email);
                        //Set register complete
                        setRegisterComplete(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: true });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    const onSubmitConfirmRegister = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RegisterConfirm = {
            email: emailRegistered as string,
            code: data.code as string,
        };

        if (registerComplete) {
            setCanSubmit(false);
            const confirmRegister = httpsCallable<
                RegisterConfirm,
                ResponseData<string>
            >(functions, "confirmRegister");
            confirmRegister(formatedData)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    navigate("/login");
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
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
