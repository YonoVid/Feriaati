import React, { useEffect, useState } from "react";
import { HttpsCallableResult } from "firebase/functions";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { checkLoginFields } from "@feria-a-ti/common/check/checkLoginFields";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import LoginForm from "@feria-a-ti/mobile/components/forms/LoginForm";
import { httpsCallable } from "@firebase/functions";
import { Button, IconButton, List } from "react-native-paper";
import {
    ProductData,
    ResponseData,
    UserToken,
    VendorCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import { ProductListFields } from "@feria-a-ti/common/model/productAddFormProps";
import { ProductList } from "../../components/productList/ProductList";
import { colors } from "@feria-a-ti/common/theme/base";
import { CommentList } from "../../components/commentList/commentList";

export interface UserVendorSelectProps {
    navigation: NavigationProp<ParamListBase>;
}

export const UserVendorSelect = (props: UserVendorSelectProps) => {
    // Context variables
    const { setSession, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Selection of vendor
    const [filterVendor, setFilterVendor] = useState<string | null>();
    // Selection of vendor
    const [selectedVendor, setSelectedVendor] =
        useState<VendorCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorCollectionData[]>([]);
    useEffect(() => {
        getVendors();
    }, []);

    const loadProducts = (data?: VendorCollectionData) => {
        const dataSource = data ? data : selectedVendor;
        const formatedData: ProductListFields = {
            idVendor: dataSource?.email as string,
        };
        const check = dataSource?.email != null && dataSource?.email != "";
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
                if (error) {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    const getVendors = async () => {
        try {
            const vendors = httpsCallable(functions, "vendorList");
            const response = await vendors();
            const vendorsData = response.data as VendorCollectionData[];
            setVendors(vendorsData);
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

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
                        <ProductList
                            label="Productos vendedor"
                            products={products}
                            isEditable={false}
                            onReload={() => loadProducts()}
                        />
                        <CommentList
                            commentsVendor={selectedVendor.email}
                            isUser={true}
                        />
                    </>
                ) : (
                    <>
                        <List.Section style={styles.container}>
                            <List.Subheader>
                                {"Lista de Vendedores"}
                            </List.Subheader>
                            {vendors.map((vendor) => (
                                <List.Item
                                    key={vendor.email}
                                    title={vendor.enterpriseName}
                                    description={vendor.region}
                                    left={(props) => (
                                        <List.Icon {...props} icon="image" />
                                    )}
                                    onPress={() => {
                                        setSelectedVendor(vendor);
                                        loadProducts(vendor);
                                    }}
                                />
                            ))}
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
