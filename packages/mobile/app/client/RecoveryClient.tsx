import React, { useState } from "react";
import { HttpsCallableResult } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { checkUpdatePassFields } from "@feria-a-ti/common/check/checkLoginFields";
import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { MessageAlert } from "@feria-a-ti/mobile/components/MessageAlert";
import RecoveryForm from "@feria-a-ti/mobile/components/forms/RecoveryForm";
import { ChangePasswordForm } from "../../components/forms/ChangePasswordForm";
import { useAppContext } from "../AppContext";

export interface LoginClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RecoveryClient = (props: LoginClientProps) => {
    // Context variables
    const { setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [submitActive, setSubmitActive] = useState(true);
    const [recoveryApproved, setRecoveryApproved] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");

    const onSubmitRecovery = (data: RecoveryFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);

        const check = data.email != null && data.email != "";
        if (check) {
            const passRecovery = httpsCallable(functions, "passRecovery");
            passRecovery(data)
                .then((result: HttpsCallableResult<ResponseData<string>>) => {
                    const {
                        msg,
                        error,
                        extra: { token, type, email },
                    } = result.data;
                    console.log(result);
                    setMessage({ msg, isError: error });
                    if (!error) {
                        setRecoveryEmail(data.email);
                        setRecoveryApproved(true);
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => setSubmitActive(true));
        }
    };

    const onSubmitChange = (data: UpdatePassFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);
        data.email = recoveryEmail;

        const check = checkUpdatePassFields(data);
        if (check) {
            const passUpdate = httpsCallable(functions, "passUpdate");
            passUpdate(data)
                .then((result: HttpsCallableResult<ResponseData<string>>) => {
                    const {
                        msg,
                        error,
                        extra: { token, type, email },
                    } = result.data;
                    console.log(result);
                    setMessage({ msg, isError: error });
                    if (!error) {
                        navigation.navigate("loginClient");
                    }
                })
                .catch((error: any) => {
                    console.log(error);
                })
                .finally(() => setSubmitActive(true));
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
