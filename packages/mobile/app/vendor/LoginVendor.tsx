import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Button } from "react-native-paper";

import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import { UserToken } from "@feria-a-ti/common/model/functionsTypes";

import { loginVendor } from "@feria-a-ti/common/functions/accessFunctions";

import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";

import { useAppContext } from "../AppContext";

export interface LoginVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const LoginVendor = (props: LoginVendorProps) => {
    // Context variables
    const { authUser, authToken, type, setSession, setMessage } =
        useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: LoginFields) => {
        setCanSubmit(false);
        console.log("SUBMIT FORM");

        loginVendor(
            { formatedData: data, setCanSubmit, setMessage },
            (value: UserToken) => {
                setSession && setSession(value);
                navigation.navigate("session");
            }
        );
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <LoginForm
                    label={"Acceso vendedor"}
                    onSubmit={onSubmit}
                    canSubmit={canSubmit}
                >
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
