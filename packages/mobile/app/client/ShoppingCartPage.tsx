import React, { useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { VendorCollectionData } from "@feria-a-ti/common/model/functionsTypes";
import { colors } from "@feria-a-ti/common/theme/base";

import { ShoppingCartComponent } from "@feria-a-ti/mobile/components/productList/ShoppingCartComponent";
import { useAppContext } from "../AppContext";
import { Card } from "react-native-paper";

export interface ShoppingCartPageProps {
    navigation: NavigationProp<ParamListBase>;
}

export const ShoppingCartPage = (props: ShoppingCartPageProps) => {
    // Context variables
    const { products, editProduct, deleteProduct } = useAppContext();
    // Navigation
    const { navigation } = props;

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorCollectionData[]>([]);

    const onEdit = (index: number, quantity: number) => {
        editProduct(index, quantity);
        return true;
    };

    const onDelete = (index: number) => {
        deleteProduct(index);
        return false;
    };

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                <Card style={styles.containerVendor}>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {"Lista de compra"}
                    </Text>
                    {products && (
                        <ShoppingCartComponent
                            onSubmit={() => console.log("BUY PRODUCTS")}
                            label={"Carro de compra"}
                            products={products}
                            isEditable={true}
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
