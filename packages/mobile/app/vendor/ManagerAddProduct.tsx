import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { ProductFields } from "@feria-a-ti/common/model/props/productAddFormProps";

import { addProduct } from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductAddForm from "@feria-a-ti/mobile/components/forms/ProductAddForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

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

        addProduct({ formatedData, setCanSubmit, setMessage }, () => {
            navigation.navigate("managerVendor");
        });
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
                    onCancel={() => navigation.navigate("managerVendor")}
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
