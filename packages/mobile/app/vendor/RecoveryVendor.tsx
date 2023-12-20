import React, { useState } from "react";
import { HttpsCallableResult } from "firebase/functions";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { checkUpdatePassFields } from "@feria-a-ti/common/check/checkLoginFields";
import {
    LoginFields,
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";

import {
    editPasswordVendor,
    recoverPasswordVendor,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import RecoveryForm from "@feria-a-ti/mobile/components/forms/RecoveryForm";
import { ChangePasswordForm } from "@feria-a-ti/mobile/components/forms/ChangePasswordForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface LoginClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RecoveryVendor = (props: LoginClientProps) => {
    // Context variables
    const { setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // UI variable
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    // Form variables
    const [submitActive, setSubmitActive] = useState(true);
    const [recoveryApproved, setRecoveryApproved] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");

    const onSubmitRecovery = (data: RecoveryFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);

        recoverPasswordVendor(
            { formatedData: data, setCanSubmit, setMessage },
            (data) => {
                setRecoveryEmail(data);
                setRecoveryApproved(true);
            }
        );
    };

    const onSubmitChange = (data: UpdatePassFields) => {
        console.log("SUBMIT FORM");
        setSubmitActive(false);
        data.email = recoveryEmail;

        editPasswordVendor(
            { formatedData: data, setCanSubmit, setMessage },
            () => {
                navigation.navigate("loginClient");
            }
        );
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
