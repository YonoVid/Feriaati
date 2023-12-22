import React, { useState } from "react";

import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import { UserVendorSelect } from "@feria-a-ti/mobile/app/client/UserVendorSelect";
import { ShoppingCart } from "@feria-a-ti/mobile/app/client/ShoppingCart";
import { FacturesClient } from "@feria-a-ti/mobile/app/client/FacturesClient";

export interface NavigationBarProps {
    navigation: NavigationProp<ParamListBase>;
}

const SessionTab = createMaterialBottomTabNavigator();

const Tab = createMaterialBottomTabNavigator();

export default function NavigationClient(props: NavigationBarProps) {
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "vendorClient",
            title: "Productos",
            focusedIcon: "cash",
        },
        {
            key: "cartClient",
            title: "Carro",
            focusedIcon: "cart",
            unfocusedIcon: "cart-outline",
        },
        {
            key: "facturesClient",
            title: "Facturas",
            focusedIcon: "file-document-multiple",
            unfocusedIcon: "file-document-multiple-outline",
        },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        vendorClient: () => UserVendorSelect(props),
        cartClient: () => ShoppingCart({ ...props, isEditable: true }),
        facturesClient: () => FacturesClient(props),
    });
    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}
