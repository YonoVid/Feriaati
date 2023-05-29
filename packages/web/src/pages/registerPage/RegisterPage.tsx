import { FieldValues } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    RegisterConfirm,
    RegisterFields,
    userStatus,
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkRegisterFields } from "@feria-a-ti/common/check/checkRegisterFields";
import RegisterUserForm from "@feria-a-ti/web/src/components/registerUserForm/RegisterUserForm";
import ConfirmRegisterForm from "@feria-a-ti/web/src/components/confirmRegisterForm/ConfirmRegisterForm";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import { Link } from "@mui/material";

function RegisterPage() {
    // Dom redirection variable
    const navigate = useNavigate();
    // Action to do on sucesfull form submit
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);
    const [canConfirmRegister, setCanConfirmRegister] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        registerComplete ? setCanConfirmRegister(true) : setCanRegister(true);
        setShowAlert(false);
    };

    const onSubmitRegister = (data: FieldValues) => {
        //Lock register button
        setCanRegister(false);
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
            //Call firebase function to create user
            const addUser = httpsCallable<RegisterFields, ResponseData<string>>(
                functions,
                "addUser"
            );
            addUser(formatedData)
                .then((result) => {
                    console.log(result);
                    //Unlock register button
                    setCanRegister(true);
                    //Set registered email
                    setEmailRegistered(data.email);
                    //Set register complete
                    setRegisterComplete(true);
                    //Show alert message
                    setAlertMessage(result.data?.msg);
                })
                .catch((error) => {
                    console.log(error);
                    setAlertMessage(messagesCode["ERR00"]);
                })
                .finally(() => setShowAlert(true));
        }
    };

    const onSubmitConfirmRegister = (data: FieldValues) => {
        setCanConfirmRegister(false);
        console.log("SUBMIT FORM");
        const formatedData: RegisterConfirm = {
            email: emailRegistered as string,
            code: data.code as string,
        };

        if (registerComplete) {
            const addUser = httpsCallable<
                RegisterConfirm,
                ResponseData<string>
            >(functions, "confirmRegister");
            addUser(formatedData)
                .then((result) => {
                    console.log(result);
                    setCanConfirmRegister(true);
                    //Show alert message
                    setAlertMessage(result.data?.msg);
                    navigate("/login");
                })
                .catch((error) => {
                    console.log(error);
                    setAlertMessage(messagesCode["ERR00"]);
                });
        }
    };

    return (
        <>
            {(registerComplete && (
                <ConfirmRegisterForm
                    onSubmit={onSubmitConfirmRegister}
                    canSubmit={canConfirmRegister}
                />
            )) || (
                <RegisterUserForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canRegister}
                >
                    <Link component="button" onClick={() => navigate("/login")}>
                        Ya tengo una cuenta
                    </Link>
                </RegisterUserForm>
            )}
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}

export default RegisterPage;
