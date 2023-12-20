import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { Button } from "react-native-paper";

import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import { UserToken } from "@feria-a-ti/common/model/functionsTypes";

import { loginBuyer } from "@feria-a-ti/common/functions/accessFunctions";

import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface LoginClientProps {
    navigation: NavigationProp<ParamListBase>;
}

export const LoginClient = (props: LoginClientProps) => {
    // Context variables
    const { setSession, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [cansubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: LoginFields) => {
        //  cetCanSubmit(false);
        console.log("SUBMIT FORM");
        setCanSubmit(false);

        loginBuyer({ formatedData: data, setCanSubmit, setMessage }, () => {
            (value: UserToken) => {
                setSession && setSession(value);
                navigation.navigate("session");
            };
        });
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <LoginForm
                    label={"Acceso cliente"}
                    onSubmit={onSubmit}
                    canSubmit={cansubmit}
                >
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate("registerClient")}
                    >
                        No tengo una cuenta
                    </Button>
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate("recoveryClient")}
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
