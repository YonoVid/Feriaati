import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { checkAddProductFields } from "@feria-a-ti/common/check/checkProductFields";
import {
    ProductData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import ProductAddForm from "../../components/forms/ProductAddForm";
import {
    ProductFields,
    ProductListFields,
} from "@feria-a-ti/common/model/productAddFormProps";
import { ProductList } from "../../components/productList/ProductList";
import { Button } from "react-native-paper";

export interface ManagerVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const ManagerVendor = (props: ManagerVendorProps) => {
    // Context variables
    const { authToken, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Server data
    const [products, setProducts] = useState<Array<ProductData>>([]);

    // Form variables
    const [productEditable, setProductEditable] = useState<ProductData | null>(
        null
    );
    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const loadProducts = () => {
        const formatedData: ProductListFields = {
            tokenVendor: authToken as string,
        };
        const check = authToken != null && authToken != "";
        console.log("SUBMIT FORM::", check);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductData>
            >(functions, "listProduct");
            addProduct(formatedData).then((result) => {
                const { msg, error, extra } = result.data as ResponseData<
                    ProductData[]
                >;
                console.log(result.data);

                setProducts(extra);
                //setIsLogged(result.data as any);
            });
        }
    };

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
                    !error && navigation.navigate("managerVendor");
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                {!productEditable ? (
                    <>
                        <ProductList
                            label="Productos"
                            products={products}
                            isEditable={true}
                        />
                        <Button
                            mode="contained-tonal"
                            disabled={!canSubmit}
                            onPress={() =>
                                navigation.navigate("managerAddProduct")
                            }
                        >
                            {"Añadir producto"}
                        </Button>
                    </>
                ) : (
                    <ProductAddForm
                        buttonLabel="Añadir producto"
                        onSubmit={onSubmit}
                        canSubmit={canSubmit}
                        setImageData={setImageData}
                        imageData={imageData}
                    />
                )}
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
