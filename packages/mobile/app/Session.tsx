import React, { useContext } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Navigate } from "react-router-dom";
import { checkSession } from "../utilities/sessionData";

// import { ComponentContext } from ".";

export interface SessionProps {
    navigation: NavigationProp<ParamListBase>;
}

export const Session = (props: SessionProps) => {
    //Navigation
    const { navigation } = props;
    //Global state variable
    // const { type } = useContext(ComponentContext);

    return (
        <>
            {!checkSession() && navigation.navigate("login")}
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
