import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegisterClient } from "./RegisterClient";
import { DefaultTheme, PaperProvider, Title } from "react-native-paper";
import { LoginClient } from "./LoginClient";
import { themePaperLight } from "@feria-a-ti/common/theme/base";

const Stack = createNativeStackNavigator();

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: themePaperLight.colors,
};

export default function App() {
    // const router = useRouter();
    const KEY = "user-token";

    // AsyncStorage.getItem(KEY).then((asyncStorageRes) => {
    //     console.log(JSON.parse(asyncStorageRes));
    //     if (asyncStorageRes == null) {
    //         router.push("/register");
    //     }
    // });

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="loginClient">
                    <Stack.Screen
                        name="loginClient"
                        component={LoginClient}
                        options={{ title: "Inicio de sesión de usuario " }}
                    />
                    <Stack.Screen
                        name="registerClient"
                        component={RegisterClient}
                        options={{ title: "Registro de usuario " }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
