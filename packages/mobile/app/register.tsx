import React from "react";
import { useRouter } from "expo-router";
import { Alert, ScrollView, StyleSheet, Button, View } from "react-native";
import { checkRegisterFields } from "../../common/checkRegisterFields";
import { RegisterFields } from "../../common/model/registerFields";
import RegisterForm from "../components/RegisterForm";

function Register() {
  const router = useRouter();
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
      <Button
        title={"TO LOGIN"}
        onPress={() => {
          router.push("/login");
        }}
      />
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
