import React, { useState } from "react";

import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { DashboardVendor } from "@feria-a-ti/mobile/app/vendor/DashboardVendor";
import { ManagerVendor } from "@feria-a-ti/mobile/app/vendor/ManagerVendor";
import { FacturesVendor } from "@feria-a-ti/mobile/app/vendor/FacturesVendor";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { BottomNavigation } from "react-native-paper";
import { YearFactureResumeCollection } from "@feria-a-ti/common/model/functionsTypes";

export interface NavigationBarProps {
    navigation: NavigationProp<ParamListBase>;
}

const SessionTab = createMaterialBottomTabNavigator();

const Tab = createMaterialBottomTabNavigator();

export default function NavigationVendor(props: NavigationBarProps) {
    const [resumes, setResumes] = useState<
        Map<number, YearFactureResumeCollection>
    >(new Map());

    const [date, setDate] = useState<Date>(new Date());

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "dashboardVendor",
            title: "Dashboard",
            focusedIcon: "chart-line",
            unfocusedIcon: "chart-line-stacked",
        },
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
        dashboardVendor: () =>
            DashboardVendor({
                ...props,
                resumes: resumes,
                setResumes: setResumes,
            }),
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
