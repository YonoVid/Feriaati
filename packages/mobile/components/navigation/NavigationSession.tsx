import React, { useState } from "react";

import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { LoginClient } from "@feria-a-ti/mobile/app/client/LoginClient";
import { LoginVendor } from "@feria-a-ti/mobile/app/vendor/LoginVendor";

import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { useAppContext } from "../../app/AppContext";
import { BottomNavigation } from "react-native-paper";

export interface NavigationBarProps {
    navigation: NavigationProp<ParamListBase>;
}

const Tab = createMaterialBottomTabNavigator();

export default function NavigationSession(props: NavigationBarProps) {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "loginClient",
            title: "Comprador",
            focusedIcon: "account",
            unfocusedIcon: "account-outline",
        },
        {
            key: "loginVendor",
            title: "Vendedor",
            focusedIcon: "tag",
            unfocusedIcon: "tag-outline",
        },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        loginClient: () => LoginClient(props),
        loginVendor: () => LoginVendor(props),
    });
    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}
