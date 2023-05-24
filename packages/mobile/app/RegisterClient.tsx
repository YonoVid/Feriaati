import React, { useState } from "react";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { app, functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkRegisterFields } from "@feria-a-ti/common/checkRegisterFields";
import {
    ConfirmRegisterFields,
    RegisterConfirm,
    RegisterFields,
    userStatus,
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import RegisterForm from "../components/RegisterForm";
import ConfirmRegisterForm from "../components/ConfirmRegisterForm";
import { MessageAlert } from "../components/MessageAlert";
import { Button, PaperProvider } from "react-native-paper";

export interface RegisterClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RegisterClient = (props: RegisterClientProps) => {
    const { navigation } = props;

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

    const onSubmitRegister = async (data: RegisterFields) => {
        setCanRegister(false);
        const check = checkRegisterFields(data);

        if (check) {
            //Call firebase function to create user
            const addUser = httpsCallable<RegisterFields, ResponseData>(
                functions,
                "addUser"
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

    const onSubmitConfirmRegister = async (data: ConfirmRegisterFields) => {
        setCanConfirmRegister(false);
        //Format data
        const formatedData: RegisterConfirm = {
            email: emailRegistered,
            code: data.code,
        };
        //Call firebase function to create user
        const confirmRegister = httpsCallable<RegisterConfirm, ResponseData>(
            functions,
            "confirmRegister"
        );
        confirmRegister(formatedData)
            .then((result) => {
                console.log(result);

                setCanConfirmRegister(true);
                setAlertMessage(messagesCode["00000"]);
                navigation.navigate("loginClient", {
                    email: { emailRegistered },
                });
            })
            .catch((error) => {
                console.log(error);
                setAlertMessage(messagesCode["ERR00"]);
            });

        console.log(data);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.innerContainer}
        >
            {(!registerComplete && (
                <RegisterForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canRegister}
                >
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate("loginClient")}
                    >
                        Ya tengo una cuenta
                    </Button>
                </RegisterForm>
            )) || (
                <ConfirmRegisterForm
                    onSubmit={onSubmitConfirmRegister}
                    canSubmit={canConfirmRegister}
                />
            )}
            <MessageAlert
                open={showAlert}
                title={"ESTADO DE ACCIÓN"}
                message={alertMessage}
                handleClose={closeAlert}
            />
        </ScrollView>
    );
};

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
