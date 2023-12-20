import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button } from "react-native-paper";

import { functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkRegisterFields } from "@feria-a-ti/common/check/checkRegisterFields";
import {
    ConfirmRegisterFields,
    RegisterConfirm,
    RegisterFields,
    userStatus,
} from "@feria-a-ti/common/model/fields/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";

import {
    confirmRegisterUser,
    registerAccountUser,
} from "@feria-a-ti/common/functions/account/registerFunctions";

import RegisterForm from "@feria-a-ti/mobile/components/forms/RegisterForm";
import ConfirmRegisterForm from "@feria-a-ti/mobile/components/forms/ConfirmRegisterForm";
import { useAppContext } from "../AppContext";

export interface RegisterClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RegisterClient = (props: RegisterClientProps) => {
    // Context variables
    const { setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;

    const [emailRegistered, setEmailRegistered] = useState("");

    const [canSubmit, setCanSubmit] = useState(true);
    const [registerComplete, setRegisterComplete] = useState(false);

    const onSubmitRegister = async (data: RegisterFields) => {
        registerAccountUser(
            { formatedData: data, setCanSubmit, setMessage },
            (value: string) => {
                //Set registered email
                setEmailRegistered(value);
                //Set register complete
                setRegisterComplete(true);
            }
        );
    };

    const onSubmitConfirmRegister = async (data: ConfirmRegisterFields) => {
        if (registerComplete) {
            confirmRegisterUser(
                { formatedData: data, setCanSubmit, setMessage },
                () => {
                    navigation.navigate("loginClient", {
                        email: { emailRegistered },
                    });
                }
            );
        }
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                {(!registerComplete && (
                    <RegisterForm
                        onSubmit={onSubmitRegister}
                        canSubmit={canSubmit}
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
