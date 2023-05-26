import React, { useState } from "react";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkRegisterVendorFields } from "@feria-a-ti/common/checkRegisterFields";
import {
    RegisterVendorFields,
    userStatus,
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { MessageAlert } from "../components/MessageAlert";
import RegisterVendorForm from "../components/RegisterVendorForm";

export interface RegisterVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RegisterVendor = () => {
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

    //Store user file data
    const [imageData, setImageData] = useState<string | ArrayBuffer>("");

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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.innerContainer}
        >
            <RegisterVendorForm
                onSubmit={onSubmitRegister}
                canSubmit={canRegister}
                setImageData={setImageData}
            />

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
