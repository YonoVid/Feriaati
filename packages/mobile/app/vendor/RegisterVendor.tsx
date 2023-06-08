import React, { useState } from "react";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkRegisterVendorFields } from "@feria-a-ti/common/check/checkRegisterFields";
import {
    RegisterVendorFields,
    userStatus,
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import RegisterVendorForm from "@feria-a-ti/mobile/components/forms/RegisterVendorForm";
import { useAppContext } from "../AppContext";

export interface RegisterVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RegisterVendor = () => {
    // Context variables
    const { setSession, setMessage } = useAppContext();

    //Account data
    const [emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);

    //Store user file data
    const [imageData, setImageData] = useState<string | ArrayBuffer>("");

    const onSubmitRegister = async (data: RegisterVendorFields) => {
        setCanRegister(false);
        const check = checkRegisterVendorFields(data);

        if (check) {
            let dataWithImage = data;
            dataWithImage.image = imageData;
            //Call firebase function to create user
            const addUser = httpsCallable<
                RegisterVendorFields,
                ResponseData<string>
            >(functions, "addVendor");
            data.status = userStatus.registered;
            addUser(data)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    //Set registered email
                    setEmailRegistered(data.email);
                    setMessage({ msg, isError: error });
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: true });
                })
                .finally(() => setCanRegister(true));
        }
        console.log(data, check);
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <RegisterVendorForm
                    onSubmit={onSubmitRegister}
                    canSubmit={canRegister}
                    setImageData={setImageData}
                />
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
