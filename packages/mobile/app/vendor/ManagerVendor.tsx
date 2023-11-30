import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import {
    checkAddProductFields,
    checkDeleteProductFields,
} from "@feria-a-ti/common/check/checkProductFields";
import {
    ProductData,
    ProductListCollectionData,
    ProductListData,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import ProductAddForm from "@feria-a-ti/mobile/components/forms/ProductAddForm";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "@feria-a-ti/common/model/props/productAddFormProps";

import { ManagerProductList } from "./ManagerProductList";
import { CommentList } from "../../components/commentList/commentList";

export interface ManagerVendorProps {
    productVendor?: ProductListData;
    setProductVendor?: (data: ProductListData) => void;
    products?: Array<ProductData>;
    setProducts?: (data: Array<ProductData>) => void;
    navigation: NavigationProp<ParamListBase>;
}

export const ManagerVendor = (props: ManagerVendorProps) => {
    // Context variables
    const { type, emailUser, authToken, checkSession, setMessage } =
        useAppContext();
    // Navigation
    const {
        productVendor,
        setProductVendor,
        products,
        setProducts,
        navigation,
    } = props;
    // Server data
    const [localProductVendor, setLocalProductVendor] =
        useState<ProductListData>();
    const [localProducts, setLocalProducts] = useState<Array<ProductData>>([]);

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

    const loadVendor = () => {
        const formatedData: ProductListFields = {
            email: emailUser,
            token: authToken as string,
        };
        const check = authToken != null && authToken != "";
        console.log("SUBMIT FORM LOAD VENDOR::", check);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductListData>
            >(functions, "getProductVendor");
            addProduct(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                if (setProductVendor) {
                    setProductVendor(extra as ProductListData);
                } else {
                    setLocalProductVendor(extra as ProductListData);
                }
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    console.log(msg);
                }
            });
        }
    };

    const loadProducts = () => {
        const formatedData: ProductListFields = {
            email: emailUser,
            token: authToken as string,
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

                if (setProducts) {
                    setProducts(extra);
                } else {
                    setLocalProducts(extra);
                }
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
            email: emailUser,
            token: authToken as string,
            idProducts: id,
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
                                    product.id !== formatedData.idProducts
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
        if (!productVendor || productVendor == null) {
            loadVendor();
            loadProducts();
        } else if (!products || products == null) {
            loadProducts();
        }
    }, []);

    useFocusEffect(() => {
        console.log("CHECK SESSION TYPE::", type);
        if (
            !checkSession() ||
            !(type === userType.vendor || type === userType.contributor)
        ) {
            navigation.reset({
                index: 0,
                routes: [{ name: "session" }],
            });
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
                        <ManagerProductList
                            navigation={navigation}
                            productVendor={productVendor || localProductVendor}
                            products={products || localProducts}
                            canSubmit={canSubmit}
                            isEditable={true}
                            loadProducts={loadProducts}
                            loadVendor={loadVendor}
                            setProductEditable={setProductEditable}
                            setCanSubmit={setCanSubmit}
                            onDelete={onDelete}
                        >
                            <CommentList
                                commentsVendor={
                                    productVendor ? productVendor.id : ""
                                }
                                isUser={false}
                            />
                        </ManagerProductList>
                    </>
                ) : (
                    <ProductAddForm
                        label="Editar producto"
                        buttonLabel="Actualizar"
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
