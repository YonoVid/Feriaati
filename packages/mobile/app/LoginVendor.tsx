import React from "react";
import { HttpsCallableResult } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";
import { httpsCallable } from "@firebase/functions";
import { Button } from "react-native-paper";

type ResultLogin = {
    user: string;
    mag: string;
    token: string;
};

export interface LoginVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const LoginVendor = (props: LoginVendorProps) => {
    const { navigation } = props;
    const onSubmit = (data: LoginFields) => {
        //  setSubmitActive(false);
        console.log("SUBMIT FORM");

        const check = checkLoginFields(data);
        if (check) {
            const login = httpsCallable(functions, "login");
            login(data)
                .then((result: HttpsCallableResult<ResultLogin>) => {
                    console.log(result);
                    Alert.alert("Error", result.data.token, [
                        {
                            text: result?.data?.token as string,
                            onPress: () => {},
                        },
                    ]);
                    //        setSubmitActive(true);
                })
                .catch((error: any) => {
                    console.log(error);
                });
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.innerContainer}
        >
            <LoginForm onSubmit={onSubmit}>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate("registerVendor")}
                >
                    No tengo una cuenta
                </Button>
                <Button
                    mode="text"
                    onPress={() => navigation.navigate("recoverPasswordVendor")}
                >
                    He olvidado mi contraseña
                </Button>
            </LoginForm>
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