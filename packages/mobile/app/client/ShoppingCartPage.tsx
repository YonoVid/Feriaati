import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { colors } from "@feria-a-ti/common/theme/base";

import { ShoppingCartComponent } from "@feria-a-ti/mobile/components/productList/ShoppingCartComponent";
import { useAppContext } from "../AppContext";
import {
    ProductId,
    ShoppingCartItem,
} from "@feria-a-ti/common/model/props/shoppingCartProps";

export interface ShoppingCartPageProps {
    navigation: NavigationProp<ParamListBase>;
    isEditable: boolean;
    loadedList?: Array<ShoppingCartItem>;
}

export const ShoppingCartPage = (props: ShoppingCartPageProps) => {
    // Context variables
    const { products, editProduct, deleteProduct } = useAppContext();
    // Navigation
    const { navigation, isEditable, loadedList } = props;

    const [productList, setProductList] = useState<Array<ShoppingCartItem>>([]);

    // State submit data
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = () => {
        if (products.size > 0) {
            navigation.navigate("buyClient");
        }
    };

    const onEdit = (id: ProductId, quantity: number) => {
        editProduct(id, quantity);
        return true;
    };

    const onDelete = (id: ProductId) => {
        deleteProduct(id);
        return false;
    };

    useEffect(() => {
        if (
            products.size > 0 &&
            (loadedList == undefined || loadedList.length == 0)
        ) {
            console.log("IS CART EMPTY?::", Object.keys(products).length > 0);
            console.log(products);
            const newList: Array<ShoppingCartItem> = [];
            products.forEach((vendor, key) => {
                console.log("VENDOR::", key);
                vendor.products.forEach((product) => newList.push(product));
            });
            setProductList(newList);
            console.log(newList);
        } else {
            setProductList([]);
        }
    }, [products]);

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                <Card style={styles.containerVendor}>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {isEditable ? "Lista de compra" : "Factura"}
                    </Text>
                    {products && (
                        <ShoppingCartComponent
                            onSubmit={onSubmit}
                            canSubmit={canSubmit}
                            label={"Carro de compra"}
                            products={loadedList || productList || []}
                            isEditable={isEditable}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    )}
                </Card>
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
    containerVendor: {
        flexGrow: 1,
        flex: 1,
        padding: 10,
        paddingBottom: 0,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
});
