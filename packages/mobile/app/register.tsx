import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { checkRegisterFields } from "../../common/checkRegisterFields";
import { RegisterFields } from "../../common/model/registerFields";
import RegisterForm from "../components/RegisterForm";

function Register() {
    const onSubmit = (data: RegisterFields) => {
        const check = !checkRegisterFields(data);

        if (check) {
            console.log(data.email);
            Alert.alert("Error", "Wrong data values", [
                {
                    text: "Ok",
                    onPress: () => {},
                },
            ]);
        }
        console.log(data, check);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.innerContainer}
        >
            <RegisterForm onSubmit={onSubmit} />
        </ScrollView>
    );
}

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

export default Register;
