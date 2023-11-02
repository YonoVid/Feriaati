import React from "react";
import { StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import { RegisterClient } from "@feria-a-ti/mobile/app/client/RegisterClient";
import { RecoveryClient } from "@feria-a-ti/mobile/app/client/RecoveryClient";
import { SearchProducts } from "@feria-a-ti/mobile/app/client/SearchProducts";
import { RegisterVendor } from "@feria-a-ti/mobile/app/vendor/RegisterVendor";
import { RecoveryVendor } from "@feria-a-ti/mobile/app/vendor/RecoveryVendor";
import { ManagerAddProduct } from "@feria-a-ti/mobile/app/vendor/ManagerAddProduct";
import { AccountManager } from "@feria-a-ti/mobile/app/account/AccountManager";
import { FactureResult } from "@feria-a-ti/mobile/app/account/FacturePage";
import SubscriptionAccount from "@feria-a-ti/mobile/app/account/SubscriptionAccount";
import NavigationSession from "@feria-a-ti/mobile/components/navigation/NavigationSession";
import NavigationClient from "@feria-a-ti/mobile/components/navigation/NavigationClient";
import NavigationVendor from "@feria-a-ti/mobile/components/navigation/NavigationVendor";
import NavigationBuy from "@feria-a-ti/mobile/components/navigation/NavigationBuy";
import AppBar from "@feria-a-ti/mobile/components/AppBar";
import { Session } from "@feria-a-ti/mobile/app/Session";
import HomeLayout from "./_layout";

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
                        name="buyClient"
                        component={NavigationBuy}
                        options={{ title: "Realizar compra" }}
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
                        name="factureStatus"
                        component={FactureResult}
                        options={{ title: "Estado de factura" }}
                    />
                    <Stack.Screen
                        name="searchProduct"
                        component={SearchProducts}
                        options={{ title: "Buscar productos" }}
                    />
                    <Stack.Screen
                        name="subscription"
                        component={SubscriptionAccount}
                        options={{ title: "Subscripción" }}
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
