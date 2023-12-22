import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";
import {
    Button,
    Card,
    IconButton,
    ActivityIndicator,
} from "react-native-paper";

import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductListFields } from "@feria-a-ti/common/model/props/productAddFormProps";
import { ShoppingCartItem } from "@feria-a-ti/common/model/props/shoppingCartProps";

import { colors } from "@feria-a-ti/common/theme/base";

import { CommentList } from "@feria-a-ti/mobile/components/commentList/commentList";
import { ProductVendorPage } from "@feria-a-ti/mobile/app/vendor/ProductVendorPage";

import { useAppContext } from "../AppContext";

export interface VendorProductsProps {
    route: { params: { vendorId: string } };
    navigation: NavigationProp<ParamListBase>;
}

export const VendorProducts = (props: VendorProductsProps) => {
    // Context variables
    const { authToken, setSession, setMessage, addProduct } = useAppContext();
    // Navigation
    const { route, navigation } = props;
    // Selection of vendor
    const [filterVendor, setFilterVendor] = useState<string | null>();
    // Selection of vendor

    const [selectedVendorId, setSelectedVendorId] = useState<string | null>();
    const [productVendor, setProductVendor] =
        useState<ProductListCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);
    const [productVendorId, setProductVendorId] = useState<string | null>();

    let defaultMessage = "Cargando datos";

    useEffect(() => {
        if (route.params != null && route.params != undefined) {
            loadVendor(route.params.vendorId);
        } else {
            defaultMessage =
                "Datos de vendedor corruptos o el vendedor no existe, intentalo nuevamente";
        }
    }, []);

    const loadVendor = (vendorId: string) => {
        setSelectedVendorId(vendorId);
        const formatedData: ProductListFields = {
            idVendor: vendorId as string,
        };
        const check = vendorId != null && vendorId != "";
        console.log("SUBMIT FORM LOAD VENDOR::", check);
        if (check) {
            const getProductVendor = httpsCallable<
                ProductListFields,
                ResponseData<ProductListCollectionData>
            >(functions, "getProductVendor");
            getProductVendor(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setProductVendor(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                } else {
                    loadProducts(extra.id);
                }
            });
        }
    };

    const loadProducts = (id: string) => {
        const dataSource = id ? id : (selectedVendorId as string);
        const formatedData: ProductListFields = {
            idVendor: id as string,
        };
        const check = id != null && id != "";
        console.log("SUBMIT FORM::", check, dataSource);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductData[]>
            >(functions, "listProduct");
            addProduct(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setProducts(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                {productVendor != null && productVendor != undefined ? (
                    <>
                        <ProductVendorPage
                            vendorId={selectedVendorId}
                            addProduct={(data: ShoppingCartItem) =>
                                productVendor != null &&
                                addProduct(data, productVendor)
                            }
                            onReload={() => loadVendor(selectedVendorId)}
                            vendorData={productVendor}
                            isEditable={false}
                            products={products}
                        />
                        <CommentList
                            commentsVendor={selectedVendorId}
                            isUser={true}
                        />
                    </>
                ) : (
                    <>
                        <Card
                            style={{
                                display: "flex",
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                alignContent: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Card.Title
                                style={{ flex: 1, height: "30%" }}
                                titleStyle={{ ...styles.title }}
                                title={"BUSCANDO VENDEDOR"}
                                subtitle={defaultMessage}
                            />
                            <Card.Content>
                                <ActivityIndicator
                                    animating={true}
                                    color={colors.secondaryShadow}
                                />
                            </Card.Content>
                            <Card.Actions>
                                <IconButton
                                    style={{
                                        width: "50%",
                                        justifyContent: "center",
                                        alignContent: "center",
                                    }}
                                    icon={"reload"}
                                    size={20}
                                    onPress={() => navigation.goBack()}
                                />
                            </Card.Actions>
                        </Card>
                    </>
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        padding: 8,
        margin: 20,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
    button: {
        marginTop: 35,
        alignContent: "center",
        color: colors.light,
        flexDirection: "row",
        height: 40,
        backgroundColor: colors.secondaryShadow,
        borderRadius: 20,
    },
    buttonInner: {
        margin: 40,
        color: colors.primaryShadow,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    title: {
        marginVertical: 20,
        textAlign: "center",
        color: colors.primaryShadow,
        fontSize: 30,
        fontWeight: "bold",
        borderRadius: 4,
    },
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    containerGlobal: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
