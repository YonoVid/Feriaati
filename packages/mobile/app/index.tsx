import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RegisterClient } from "./RegisterClient";
import { DefaultTheme, PaperProvider, Title } from "react-native-paper";
import { LoginClient } from "@feria-a-ti/mobile/app/LoginClient";
import { themePaperLight } from "@feria-a-ti/common/theme/base";
import AppBar from "@feria-a-ti/mobile/components/AppBar";
import { LoginVendor } from "@feria-a-ti/mobile/app/LoginVendor";
import { RegisterVendor } from "@feria-a-ti/mobile/app/RegisterVendor";

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
                <Stack.Navigator
                    initialRouteName="loginClient"
                    screenOptions={{
                        header: (props) => <AppBar {...props} />,
                    }}
                >
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
                    <Stack.Screen
                        name="loginVendor"
                        component={LoginVendor}
                        options={{ title: "Inicio de sesión de vendedor " }}
                    />
                    <Stack.Screen
                        name="registerVendor"
                        component={RegisterVendor}
                        options={{ title: "Registro de vendedor " }}
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
