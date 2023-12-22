import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { RegisterVendorFields } from "@feria-a-ti/common/model/fields/registerFields";

import { registerAccountVendor } from "@feria-a-ti/common/functions/account/registerFunctions";

import RegisterVendorForm from "@feria-a-ti/mobile/components/forms/RegisterVendorForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface RegisterVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const RegisterVendor = (props: RegisterVendorProps) => {
    // Context variables
    const { setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;

    //Account data
    const [_emailRegistered, setEmailRegistered] = useState("");

    const [canRegister, setCanRegister] = useState(true);

    //UI variables
    const [canSubmit, setCanSubmit] = useState<boolean>();

    //Store user file data
    const [_imageData, setImageData] = useState<string | ArrayBuffer>("");

    const onSubmitRegister = async (data: RegisterVendorFields) => {
        registerAccountVendor(
            { formatedData: data, setCanSubmit, setMessage },
            () => {
                setEmailRegistered(data.email);
                navigation.navigate("/loginVendor");
            }
        );
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
