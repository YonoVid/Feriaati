import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

import { ShoppingCartProps } from "@feria-a-ti/common/model/props/shoppingCartProps";

import { CartProductView } from "./CartProductView";

export const ShoppingCartComponent = (props: ShoppingCartProps) => {
    const {
        label,
        color,
        children,
        products,
        isEditable,
        canSubmit,
        onSubmit,
        onEdit,
        onDelete,
    } = props;

    const [total, setTotal] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        if (products) {
            let newTotal = 0;
            products.forEach((item) => {
                let finalPrice = item.value.price;
                if (
                    item.value.discount != undefined &&
                    item.value.discount != null &&
                    item.value.promotion != undefined &&
                    item.value.promotion != null &&
                    item.value?.discount != "none"
                ) {
                    finalPrice -=
                        item.value.discount == "percentage"
                            ? (finalPrice * item.value.promotion) / 100
                            : item.value.promotion;
                }
                newTotal += item.quantity * finalPrice;
            });
            setTotal(newTotal);
        }
    }, [products]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "column" }}>
                {products.map((product, index) => (
                    <View key={product.value.name + index}>
                        <CartProductView
                            isEditable={isEditable}
                            onEdit={(quantity) =>
                                onEdit && onEdit(product.id, quantity)
                            }
                            onDelete={() => onDelete && onDelete(product.id)}
                            product={product.value}
                            quantity={product.quantity}
                        />
                    </View>
                ))}
                <Card>
                    <Card.Title title={"TOTAL: $" + numberWithCommas(total)} />
                </Card>
                {isEditable && (
                    <View style={styles.button}>
                        <Button
                            mode="contained"
                            color={styles.buttonInner.color}
                            disabled={!canSubmit}
                            onPress={props.onSubmit}
                        >
                            Realizar compra
                        </Button>
                    </View>
                )}
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
