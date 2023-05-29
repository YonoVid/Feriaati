import React, { useContext, useState } from "react";
import { HttpsCallableResult } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import {
    checkLoginFields,
    checkUpdatePassFields,
} from "@feria-a-ti/common/check/checkLoginFields";
import {
    LoginFields,
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";
import { httpsCallable } from "@firebase/functions";
import { Button } from "react-native-paper";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { MessageAlert } from "@feria-a-ti/mobile/components/MessageAlert";
import { ComponentContext } from "..";
import { setSession } from "@feria-a-ti/mobile/utilities/sessionData";
import RecoveryForm from "@feria-a-ti/mobile/components/forms/RecoveryForm";
import { ChangePasswordForm } from "../../components/forms/ChangePasswordForm";

export interface LoginClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RecoveryVendor = (props: LoginClientProps) => {
    //Navigation
    const { navigation } = props;
    // Form variables
    const [submitActive, setSubmitActive] = useState(true);
    const [recoveryApproved, setRecoveryApproved] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");
    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("ERROR");
    const closeAlert = () => {
        setSubmitActive(true);
        setShowAlert(false);
    };

    const onSubmitRecovery = (data: RecoveryFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);

        const check = data.email != null && data.email != "";
        if (check) {
            const passRecovery = httpsCallable(functions, "passRecoveryVendor");
            passRecovery(data)
                .then((result: HttpsCallableResult<ResponseData<string>>) => {
                    const {
                        msg,
                        error,
                        extra: { token, type, email },
                    } = result.data;
                    console.log(result);
                    setAlertMessage(msg);
                    if (!error) {
                        setRecoveryEmail(data.email);
                        setRecoveryApproved(true);
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => setShowAlert(true));
        }
    };

    const onSubmitChange = (data: UpdatePassFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);
        data.email = recoveryEmail;

        const check = checkUpdatePassFields(data);
        if (check) {
            const passUpdate = httpsCallable(functions, "passUpdateVendor");
            passUpdate(data)
                .then((result: HttpsCallableResult<ResponseData<string>>) => {
                    const {
                        msg,
                        error,
                        extra: { token, type, email },
                    } = result.data;
                    console.log(result);
                    setAlertMessage(msg);
                    if (!error) {
                        navigation.navigate("loginClient");
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => setShowAlert(true));
        }
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                {recoveryApproved ? (
                    <ChangePasswordForm
                        onSubmit={onSubmitChange}
                        canSubmit={submitActive}
                    />
                ) : (
                    <RecoveryForm
                        onSubmit={onSubmitRecovery}
                        canSubmit={submitActive}
                    />
                )}
            </ScrollView>
            <MessageAlert
                open={showAlert}
                title={"ESTADO DE ACCIÓN"}
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
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
