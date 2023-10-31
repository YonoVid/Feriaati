import React, { useState } from "react";

import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { ManagerVendor } from "@feria-a-ti/mobile/app/vendor/ManagerVendor";
import { FacturesVendor } from "@feria-a-ti/mobile/app/vendor/FacturesVendor";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { BottomNavigation } from "react-native-paper";

export interface NavigationBarProps {
    navigation: NavigationProp<ParamListBase>;
}

const SessionTab = createMaterialBottomTabNavigator();

const Tab = createMaterialBottomTabNavigator();

export default function NavigationVendor(props: NavigationBarProps) {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "managerVendor",
            title: "Productos",
            focusedIcon: "store",
            unfocusedIcon: "store-outline",
        },
        {
            key: "facturesVendor",
            title: "Facturas",
            focusedIcon: "file-document-multiple",
            unfocusedIcon: "file-document-multiple-outline",
        },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        managerVendor: () => ManagerVendor(props),
        facturesVendor: () => FacturesVendor(props),
    });
    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}
