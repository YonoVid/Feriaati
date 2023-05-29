import React, { useState } from "react";
import { HttpsCallableResult } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";
import { httpsCallable } from "@firebase/functions";
import { Button } from "react-native-paper";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { MessageAlert } from "@feria-a-ti/mobile/components/MessageAlert";

export interface LoginVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const LoginVendor = (props: LoginVendorProps) => {
    const { navigation } = props;
    // Form variables
    const [submitActive, setSubmitActive] = useState(true);
    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("ERROR");
    const closeAlert = () => {
        setSubmitActive(true);
        setShowAlert(false);
    };

    const onSubmit = (data: LoginFields) => {
        //  setSubmitActive(false);
        console.log("SUBMIT FORM");

        const check = checkLoginFields(data);
        if (check) {
            const login = httpsCallable(functions, "login");
            login(data)
                .then(
                    (result: HttpsCallableResult<ResponseData<UserToken>>) => {
                        const {
                            msg,
                            extra: { token, type, email },
                        } = result.data;
                        console.log(result);
                        setAlertMessage(msg);
                        if (token != null && token != "") {
                            // setSession({ token, type, email });
                            navigation.navigate("session");
                        }
                        setSubmitActive(true);
                    }
                )
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
                <LoginForm onSubmit={onSubmit} canSubmit={submitActive}>
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate("registerVendor")}
                    >
                        No tengo una cuenta
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate("recoveryVendor")}
                    >
                        He olvidado mi contraseña
                    </Button>
                </LoginForm>
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
