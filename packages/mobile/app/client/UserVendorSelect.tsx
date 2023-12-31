import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import algoliarecommend from "@algolia/recommend";
import { Hit } from "@algolia/client-search";

import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";
import { Button, IconButton, List, Text } from "react-native-paper";

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

const recommendClient = algoliarecommend(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);
const indexName = "dev_feriaati";

export interface UserVendorSelectProps {
    navigation: NavigationProp<ParamListBase>;
}

export const UserVendorSelect = (props: UserVendorSelectProps) => {
    // Context variables
    const { authToken, emailUser, type, setSession, setMessage, addProduct } =
        useAppContext();
    // Navigation
    const { navigation } = props;
    // Recomendations
    const [recomendations, setRecomendations] = useState<Array<Hit<any>>>([]);
    // Selection of vendor
    const [filterVendor, setFilterVendor] = useState<string | null>();
    // Selection of vendor
    const [selectedVendor, setSelectedVendor] = useState<VendorData | null>();

    const [selectedVendorId, setSelectedVendorId] = useState<string | null>();
    const [productVendor, setProductVendor] =
        useState<ProductListCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);
    const [productVendorId, setProductVendorId] = useState<string | null>();

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorData[]>([]);
    useEffect(() => {
        if (vendors.length < 1) {
            getVendors();
        }
        if (recomendations.length == 0) {
            recommendClient
                .getTrendingItems([
                    {
                        indexName: indexName,
                        threshold: 10,
                    },
                ])
                .then(({ results }) => {
                    let hits = [];
                    results.forEach((result) => {
                        console.log(result.hits);
                        hits = hits.concat(result.hits);
                    });
                    console.log("HITS::", hits.length);
                    setRecomendations(hits);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);

    const loadVendor = (vendorId: string) => {
        setSelectedVendorId(vendorId);
        const formatedData: ProductListFields = {
            token: authToken,
            email: emailUser as string,
            idProducts: vendorId as string,
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
            token: authToken,
            email: emailUser as string,
            idProducts: id as string,
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

    const getVendors = async () => {
        try {
            const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
                functions,
                "vendorListUser"
            );
            vendors(authToken).then((response) => {
                const { error, extra } = response.data;
                if (!error) {
                    const vendorsData = extra as VendorData[];
                    setVendors(vendorsData);
                }
            });
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    function TrendingItem({ item }) {
        return (
            <pre>
                <code>{JSON.stringify(item)}</code>
            </pre>
        );
    }

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                {selectedVendor ? (
                    <>
                        <IconButton
                            icon="arrow-left"
                            onPress={() => setSelectedVendor(null)}
                        />
                        <ProductVendorPage
                            vendorId={selectedVendor.id}
                            addProduct={(data: ShoppingCartItem) =>
                                productVendor != null &&
                                addProduct(data, productVendor)
                            }
                            onReload={getVendors}
                            vendorData={selectedVendor}
                            isEditable={false}
                            products={products}
                        />
                        <CommentList
                            commentsVendor={selectedVendor.id}
                            isUser={true}
                        />
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                ...styles.button,
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <Button
                                mode="contained"
                                color={styles.buttonInner.backgroundColor}
                                onPress={() =>
                                    navigation.navigate("searchProduct")
                                }
                            >
                                {"Buscar productos"}
                            </Button>
                        </View>
                        <List.Section style={styles.container}>
                            <>
                                <List.Subheader>
                                    {"Lista de Vendedores"}
                                </List.Subheader>
                                <Text>
                                    Recomendations:{recomendations.length}
                                </Text>
                                {recomendations.map((hit) => {
                                    <List.Item
                                        key={hit.objectID}
                                        title={hit.name}
                                        description={hit.description}
                                        left={(props) => (
                                            <List.Icon
                                                {...props}
                                                icon="image"
                                            />
                                        )}
                                        onPress={() => {
                                            // setSelectedVendor(vendor);
                                            // loadVendor(vendor.id);
                                        }}
                                    />;
                                })}
                                {vendors.map((vendor) => (
                                    <List.Item
                                        key={vendor.id}
                                        title={vendor.enterpriseName}
                                        description={vendor.region}
                                        left={(props) => (
                                            <List.Icon
                                                {...props}
                                                icon="image"
                                            />
                                        )}
                                        onPress={() => {
                                            setSelectedVendor(vendor);
                                            loadVendor(vendor.id);
                                        }}
                                    />
                                ))}
                            </>
                        </List.Section>
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
