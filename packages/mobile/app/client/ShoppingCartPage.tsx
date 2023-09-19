import React, { useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import {
    ProductFactureData,
    ProductUnit,
    ResponseData,
    VendorCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";
import { colors } from "@feria-a-ti/common/theme/base";

import { functions } from "@feria-a-ti/common/firebase";
import { ShoppingCartComponent } from "@feria-a-ti/mobile/components/productList/ShoppingCartComponent";
import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";
import { useAppContext } from "../AppContext";

export interface ShoppingCartPageProps {
    navigation: NavigationProp<ParamListBase>;
}

export const ShoppingCartPage = (props: ShoppingCartPageProps) => {
    // Context variables
    const { authToken, setMessage, resetProduct } = useAppContext();
    // Context variables
    const { products, editProduct, deleteProduct } = useAppContext();
    // Navigation
    const { navigation } = props;

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorCollectionData[]>([]);

    // State submit data
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = () => {
        setCanSubmit(false);
        const productPetition: { [id: string]: ProductFactureData[] } = {};

        console.log("SUBMIT BUYING PETITION");
        console.log(products);
        products.forEach((product) => {
            const { id, value, quantity } = product;

            const finalPrice =
                value.price -
                (value.discount !== "none"
                    ? value.discount === "percentage"
                        ? (value.price * value.promotion) / 100
                        : value.promotion
                    : 0);
            const unitLabel =
                "(" +
                (value.unitType === ProductUnit.GRAM
                    ? value.unit + "gr."
                    : value.unitType === ProductUnit.KILOGRAM
                    ? "kg."
                    : "unidad") +
                ")";

            productPetition[id.vendorId] = [
                {
                    id: id.productId,
                    name: product.value.name + unitLabel,
                    quantity: quantity,
                    subtotal: finalPrice * quantity,
                },
                ...(productPetition[product.id.vendorId] || []),
            ];
        });
        console.log(productPetition);

        const buyProductUser = httpsCallable<
            ProductFactureFields,
            ResponseData<string>
        >(functions, "buyProductUser");
        buyProductUser({
            token: authToken as string,
            products: productPetition,
        })
            .then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setMessage({ msg, isError: error });
                if (!error) {
                    resetProduct();
                }
                //setIsLogged(result.data as any);
            })
            .finally(() => setCanSubmit(true));
    };

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
                            onSubmit={onSubmit}
                            canSubmit={canSubmit}
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
