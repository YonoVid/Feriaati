import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Navigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import { userType } from "@feria-a-ti/common/model/functionsTypes";
import { useFocusEffect } from "expo-router";

// import { ComponentContext } from ".";

export interface SessionProps {
    navigation: NavigationProp<ParamListBase>;
}

export const Session = (props: SessionProps) => {
    // Context variables
    const { authUser, type, checkSession } = useAppContext();
    // Navigation
    const { navigation } = props;
    //Global state variable
    // const { type } = useContext(ComponentContext);

    useFocusEffect(() => {
        if (checkSession()) {
            console.log("USER TOKEN::", authUser);
            console.log("USER TYPE::", type);
            if (type === userType.vendor) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "managerVendor" }],
                });
            } else if (type === userType.user) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "userVendorSelect" }],
                });
            }
        } else {
            navigation.reset({
                index: 0,
                routes: [{ name: "loginClient" }],
            });
        }
    });

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <Text>WELCOME USER {"type"}!</Text>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
