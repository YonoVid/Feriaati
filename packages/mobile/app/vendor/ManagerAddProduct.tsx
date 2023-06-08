import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { checkAddProductFields } from "@feria-a-ti/common/check/checkProductFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import ProductAddForm from "../../components/forms/ProductAddForm";
import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";

export interface ManagerAddProductProps {
    navigation: NavigationProp<ParamListBase>;
}

export const ManagerAddProduct = (props: ManagerAddProductProps) => {
    // Context variables
    const { authToken, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: ProductFields) => {
        const formatedData: ProductFields = {
            ...data,
            tokenVendor: authToken,
            image: imageData,
        };
        const check = checkAddProductFields(formatedData);
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const addProduct = httpsCallable<
                ProductFields,
                ResponseData<string>
            >(functions, "addProduct");
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    !error && navigation.navigate("ManagerAddProduct");
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <ProductAddForm
                    buttonLabel="Añadir producto"
                    onSubmit={onSubmit}
                    canSubmit={canSubmit}
                    setImageData={setImageData}
                    imageData={imageData}
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
