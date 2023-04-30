import { useRouter } from "expo-router";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
    const router = useRouter();
    const KEY = "user-token";

    AsyncStorage.getItem(KEY).then((asyncStorageRes) => {
        console.log(JSON.parse(asyncStorageRes));
        if (asyncStorageRes == null) {
            router.push("/register");
        }
    });

    return (
        <View style={styles.container}>
            <Text>HOME PAGE</Text>
            <Button
                title={"TO REGISTER"}
                onPress={() => {
                    router.push("/register");
                }}
            />
        </View>
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
