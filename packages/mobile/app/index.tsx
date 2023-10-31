import React from "react";
import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import AppBar from "@feria-a-ti/mobile/components/AppBar";
import { Session } from "@feria-a-ti/mobile/app/Session";
import { LoginClient } from "@feria-a-ti/mobile/app/client/LoginClient";
import { RegisterClient } from "@feria-a-ti/mobile/app/client/RegisterClient";
import { RecoveryClient } from "@feria-a-ti/mobile/app/client/RecoveryClient";
import { LoginVendor } from "@feria-a-ti/mobile/app/vendor/LoginVendor";
import { RegisterVendor } from "@feria-a-ti/mobile/app/vendor/RegisterVendor";
import { RecoveryVendor } from "@feria-a-ti/mobile/app/vendor/RecoveryVendor";
import HomeLayout from "./_layout";
import { ManagerAddProduct } from "./vendor/ManagerAddProduct";
import { ManagerVendor } from "./vendor/ManagerVendor";
import { UserVendorSelect } from "./client/UserVendorSelect";
import { AccountManager } from "./account/AccountManager";
import { ShoppingCartPage } from "./client/ShoppingCartPage";
import { FacturesClient } from "./client/FacturesClient";
import { FacturesVendor } from "./vendor/FacturesVendor";
import NavigationSession from "../components/navigation/NavigationSession";
import NavigationClient from "../components/navigation/NavigationClient";
import NavigationVendor from "../components/navigation/NavigationVendor";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <HomeLayout>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="session"
                    screenOptions={{
                        header: (props) => <AppBar {...props} />,
                    }}
                >
                    <Stack.Screen
                        name="login"
                        component={NavigationSession}
                        options={{ title: "Inicio de sesión" }}
                    />
                    <Stack.Screen
                        name="client"
                        component={NavigationClient}
                        options={{ title: "Cuenta comprador" }}
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
                        name="vendor"
                        component={NavigationVendor}
                        options={{ title: "Cuenta de vendedor " }}
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
                        name="managerAddProduct"
                        component={ManagerAddProduct}
                        options={{ title: "Añadir producto " }}
                    />
                    <Stack.Screen
                        name="accountManager"
                        component={AccountManager}
                        options={{ title: "Gestionar cuenta" }}
                    />
                    <Stack.Screen
                        name="session"
                        component={Session}
                        options={{ title: "Session iniciada " }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </HomeLayout>
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
