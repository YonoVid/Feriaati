import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import {
    checkAddProductFields,
    checkDeleteProductFields,
} from "@feria-a-ti/common/check/checkProductFields";
import {
    ProductData,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import ProductAddForm from "../../components/forms/ProductAddForm";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "@feria-a-ti/common/model/productAddFormProps";
import { ProductList } from "../../components/productList/ProductList";
import { Button } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { checkSession } from "../../utilities/sessionData";

export interface ManagerVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const ManagerVendor = (props: ManagerVendorProps) => {
    // Context variables
    const { type, authToken, setMessage } = useAppContext();
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
        console.log(formatedData);
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

    const onEdit = (data: ProductFields) => {
        const formatedData: ProductEditFields = {
            id: productEditable?.id,
            ...data,
            tokenVendor: authToken,
            image: imageData,
        };
        const check = checkAddProductFields(formatedData);
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const editProduct = httpsCallable<
                ProductEditFields,
                ResponseData<string>
            >(functions, "editProduct");
            editProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    //setIsLogged(result.data as any);
                    if (!error) {
                        setProductEditable(null);
                        loadProducts();
                    }
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    const onDelete = (id: string) => {
        const formatedData: ProductDeleteFields = {
            tokenVendor: authToken as string,
            productId: id,
        };
        const check = checkDeleteProductFields(formatedData);
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const addProduct = httpsCallable<
                ProductDeleteFields,
                ResponseData<string>
            >(functions, "deleteProduct");
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result.data);

                    !error &&
                        setProducts(
                            products.filter(
                                (product) =>
                                    product.id !== formatedData.productId
                            )
                        );
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

    useFocusEffect(() => {
        if (checkSession()) {
            if (type !== userType.vendor) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "session" }],
                });
            }
        }
    });

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
                            onEdit={(data: ProductData | null) => {
                                setProductEditable(data);
                            }}
                            onReload={() => loadProducts()}
                            onDelete={onDelete}
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
                        onSubmit={onEdit}
                        onCancel={() => setProductEditable(null)}
                        canSubmit={canSubmit}
                        editableState={productEditable}
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
