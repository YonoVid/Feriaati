import { themePaperLight } from "@feria-a-ti/common/theme/base";
import { Slot } from "expo-router";
import React from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { AppContext } from "./AppContext";

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: themePaperLight.colors,
};

export default function HomeLayout(props: { children: any }) {
    return (
        <PaperProvider theme={theme}>
            <AppContext>{props.children}</AppContext>
        </PaperProvider>
    );
}
