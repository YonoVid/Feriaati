import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

import { colors } from "@feria-a-ti/common/theme/base";

import { ShoppingCartProps } from "@feria-a-ti/common/model/props/shoppingCartProps";
import { CartProductView } from "./CartProductView";
import { Card } from "react-native-paper";

export const ShoppingCartComponent = (props: ShoppingCartProps) => {
    const { label, color, children, products, isEditable, onEdit, onDelete } =
        props;

    const [total, setTotal] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        let newTotal = 0;
        products.forEach((item) => {
            const finalPrice =
                item.value.price -
                (item.value.discount !== "none"
                    ? item.value.discount === "percentage"
                        ? (item.value.price * item.value.promotion) / 100
                        : item.value.promotion
                    : 0);
            newTotal += item.quantity * finalPrice;
        });
        setTotal(newTotal);
    }, [products]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "column" }}>
                {products.map((product, index) => (
                    <View key={product.value.name + index}>
                        <CartProductView
                            onEdit={(quantity) =>
                                onEdit && onEdit(index, quantity)
                            }
                            onDelete={() => onDelete && onDelete(index)}
                            product={product.value}
                            quantity={product.quantity}
                        />
                    </View>
                ))}
                <Card>
                    <Card.Title title={"TOTAL: $" + total} />
                </Card>
            </View>
        </View>
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
});
