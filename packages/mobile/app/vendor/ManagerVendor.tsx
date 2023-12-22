import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import {
    ProductData,
    ProductListData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "@feria-a-ti/common/model/props/productAddFormProps";

import {
    editProduct,
    deleteProduct,
    listProducts,
    loadVendorProduct,
} from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductAddForm from "@feria-a-ti/mobile/components/forms/ProductAddForm";
import { CommentList } from "@feria-a-ti/mobile/components/commentList/commentList";

import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";
import { ManagerProductList } from "./ManagerProductList";

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
    const [vendorId, setVendorId] = useState<string>();
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

    const onLoadVendor = () => {
        const formatedData: ProductListFields = {
            email: emailUser,
            token: authToken as string,
        };

        loadVendorProduct(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                if (setProductVendor) {
                    setProductVendor(data);
                } else {
                    setLocalProductVendor(data);
                }
                setVendorId(data.id);
            }
        );
    };

    const onLoadProducts = () => {
        const formatedData: ProductListFields = {
            email: emailUser,
            token: authToken as string,
        };

        listProducts({ formatedData, setCanSubmit, setMessage }, (data) => {
            if (setProducts) {
                setProducts(data);
            } else {
                setLocalProducts(data);
            }
        });
    };

    const onEdit = (data: ProductFields) => {
        const formatedData: ProductEditFields = {
            id: productEditable?.id as string,
            tokenVendor: authToken as string,
            name: data.name as string,
            description: data.description as string,
            unitType: data.unitType,
            unit: data.unit as number,
            price: data.price as number,
            discount: data.discount,
            promotion: data.promotion as number,
            image: imageData,
        };

        editProduct({ formatedData, setCanSubmit, setMessage }, () => {
            setProductEditable(null);
            onLoadProducts();
        });
    };

    const onDelete = (id: string) => {
        const formatedData: ProductDeleteFields = {
            email: emailUser,
            token: authToken as string,
            idProducts: id,
        };

        deleteProduct({ formatedData, setCanSubmit, setMessage }, () => {
            setProducts(
                products.filter(
                    (product) => product.id !== formatedData.idProducts
                )
            );
        });
    };

    useEffect(() => {
        if (!productVendor || productVendor == null) {
            onLoadVendor();
            onLoadProducts();
        } else if (!products || products == null) {
            onLoadProducts();
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
                            loadProducts={onLoadProducts}
                            loadVendor={onLoadVendor}
                            setProductEditable={setProductEditable}
                            setCanSubmit={setCanSubmit}
                            onDelete={onDelete}
                        >
                            <CommentList
                                commentsVendor={vendorId ? vendorId : ""}
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
