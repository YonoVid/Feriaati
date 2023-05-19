import React, { useState } from "react";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { app, functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import {
    checkRegisterFields,
    checkRegisterVendorFields,
} from "../../common/checkRegisterFields";
import {
    ConfirmRegisterFields,
    RegisterConfirm,
    RegisterFields,
    RegisterVendorFields,
    userStatus,
} from "../../common/model/registerFields";
import { ResponseData } from "../../common/model/functionsTypes";
import RegisterForm from "../components/RegisterForm";
import ConfirmRegisterForm from "../components/ConfirmRegisterForm";
import { MessageAlert } from "../components/MessageAlert";
import { PaperProvider } from "react-native-paper";
import RegisterVendorForm from "../components/RegisterVendorForm";

function Register() {
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        setCanRegister(true);
        setShowAlert(false);
    };

    const onSubmitRegister = async (data: RegisterVendorFields) => {
        setCanRegister(false);
        const check = checkRegisterVendorFields(data);

        if (check) {
            //Call firebase function to create user
            const addUser = httpsCallable<RegisterVendorFields, ResponseData>(
                functions,
                "addVendor"
            );
            data.status = userStatus.registered;
            addUser(data)
                .then((result) => {
                    console.log(result);
                    //Unlock register button
                    setCanRegister(true);
                    //Set registered email
                    setEmailRegistered(data.email);
                    //Set register complete
                    setRegisterComplete(true);
                    setAlertMessage(result.data?.msg);
                })
                .catch((error) => {
                    console.log(error);
                    setAlertMessage(messagesCode["ERR00"]);
                })
                .finally(() => setShowAlert(true));
        }
        console.log(data, check);
    };

    return (
        <PaperProvider>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <RegisterVendorForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canRegister}
                />

                <MessageAlert
                    open={showAlert}
                    title={"ESTADO DE ACCIÓN"}
                    message={alertMessage}
                    handleClose={closeAlert}
                />
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});

export default Register;
