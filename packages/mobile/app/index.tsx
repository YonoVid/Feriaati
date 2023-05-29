import React, { createContext, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { DefaultTheme, PaperProvider, Title } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { themePaperLight } from "@feria-a-ti/common/theme/base";
import { SessionUserData } from "@feria-a-ti/common/model/sessionType";

import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import AppBar from "@feria-a-ti/mobile/components/AppBar";
import { Session } from "@feria-a-ti/mobile/app/Session";
import { LoginClient } from "@feria-a-ti/mobile/app/client/LoginClient";
import { RegisterClient } from "@feria-a-ti/mobile/app/client/RegisterClient";
import { RecoveryClient } from "@feria-a-ti/mobile/app/client/RecoveryClient";
import { LoginVendor } from "@feria-a-ti/mobile/app/vendor/LoginVendor";
import { RegisterVendor } from "@feria-a-ti/mobile/app/vendor/RegisterVendor";
import { RecoveryVendor } from "@feria-a-ti/mobile/app/vendor/RecoveryVendor";

const Stack = createNativeStackNavigator();

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: themePaperLight.colors,
};

export const ComponentContext = createContext<SessionUserData>({
    authUser: "",
    authToken: "",
    type: userType.undefined,
    setSession: (data: UserToken) => {
        data;
    },
    resetSession: () => false,
    checkSession: () => false,
});

export default function App() {
    const [user, setUser] = useState<string>("");
    const [type, setType] = useState<userType>();

    const setSession = (data: UserToken) => {
        setUser(data.email);
        setType(data.type);
    };

    const resetSession = () => {
        setUser("");
        setType(userType.undefined);
    };

    const checkSession = () => {
        return user != "" && type != userType.undefined;
    };

    // useEffect(() => {});

    return (
        <PaperProvider theme={theme}>
            <ComponentContext.Provider
                value={{
                    authUser: user,
                    authToken: "",
                    type,
                    setSession,
                    resetSession,
                    checkSession,
                }}
            >
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
                            name="recoveryClient"
                            component={RecoveryClient}
                            options={{ title: "Recuperar cuenta de usuario " }}
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
                        <Stack.Screen
                            name="recoveryVendor"
                            component={RecoveryVendor}
                            options={{ title: "Recuperar cuenta de vendedor " }}
                        />
                        <Stack.Screen
                            name="session"
                            component={Session}
                            options={{ title: "Session iniciada " }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </ComponentContext.Provider>
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
