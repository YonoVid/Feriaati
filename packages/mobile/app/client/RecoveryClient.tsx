import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";
import RecoveryForm from "@feria-a-ti/mobile/components/forms/RecoveryForm";
import { ChangePasswordForm } from "@feria-a-ti/mobile/components/forms/ChangePasswordForm";

import {
    editPasswordUser,
    recoverPasswordUser,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface LoginClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RecoveryClient = (props: LoginClientProps) => {
    // Context variables
    const { setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [canSubmit, setCanSubmit] = useState(true);
    const [recoveryApproved, setRecoveryApproved] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState("");

    const onSubmitRecovery = (data: RecoveryFields) => {
        console.log("SUBMIT FORM");

        recoverPasswordUser(
            { formatedData: data, setCanSubmit, setMessage },
            (value: string) => {
                setRecoveryEmail(value);
                setRecoveryApproved(true);
            }
        );
    };

    const onSubmitChange = (data: UpdatePassFields) => {
        console.log("SUBMIT FORM");
        data.email = recoveryEmail;

        editPasswordUser(
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
                        canSubmit={canSubmit}
                    />
                ) : (
                    <RecoveryForm
                        onSubmit={onSubmitRecovery}
                        canSubmit={canSubmit}
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
