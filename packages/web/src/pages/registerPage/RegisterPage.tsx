import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    RegisterConfirm,
    RegisterFields,
    userStatus,
} from "@feria-a-ti/common/model/fields/registerFields";
import { checkRegisterFields } from "@feria-a-ti/common/check/checkRegisterFields";
import RegisterForm from "@feria-a-ti/web/src/components/forms/registerUserForm/RegisterUserForm";
import ConfirmRegisterForm from "@feria-a-ti/web/src/components/forms/confirmRegisterForm/ConfirmRegisterForm";
import "../../App.css";

function RegisterPage() {
    //Import and prepare firebase data and reference
    //const auth = getAuth(app);
    //Action to do on sucesfull form submit
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);
    const [canConfirmRegister, setCanConfirmRegister] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

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
            const addUser = httpsCallable(functions, "addUser");
            addUser(formatedData).then((result) => {
                console.log(result);
                //Unlock register button
                setCanRegister(true);
                //Set registered email
                setEmailRegistered(data.email);
                //Set register complete
                setRegisterComplete(true);
            });
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
            const addUser = httpsCallable(functions, "confirmRegister");
            addUser(formatedData).then((result) => {
                console.log(result);
                setCanConfirmRegister(true);
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
                <RegisterForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canRegister}
                />
            )}
        </>
    );
}

export default RegisterPage;
