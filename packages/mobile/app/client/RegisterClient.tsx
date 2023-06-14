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
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
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
        setCanSubmit(false);
        const check = checkRegisterFields(data);

        if (check) {
            //Call firebase function to create user
            const addUser = httpsCallable<RegisterFields, ResponseData<string>>(
                functions,
                "addUser"
            );
            data.status = userStatus.registered;
            addUser(data)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    //Set registered email
                    setEmailRegistered(data.email);
                    //Set register complete
                    setRegisterComplete(true);
                    setMessage({ msg, isError: error });
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: true });
                })
                .finally(() => setCanSubmit(true));
        }
        console.log(data, check);
    };

    const onSubmitConfirmRegister = async (data: ConfirmRegisterFields) => {
        setCanSubmit(false);
        //Format data
        const formatedData: RegisterConfirm = {
            email: emailRegistered,
            code: data.code,
        };
        //Call firebase function to create user
        const confirmRegister = httpsCallable<
            RegisterConfirm,
            ResponseData<string>
        >(functions, "confirmRegister");
        confirmRegister(formatedData)
            .then((result) => {
                const { msg, error } = result.data;
                console.log(result);

                setMessage({ msg, isError: error });
                navigation.navigate("loginClient", {
                    email: { emailRegistered },
                });
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: true });
            })
            .finally(() => setCanSubmit(true));

        console.log(data);
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
