import "react-native-get-random-values";
import React, { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";
import { colors } from "@feria-a-ti/common/theme/base";

import {
    ProductCollectionData,
    ProductData,
} from "@feria-a-ti/common/model/functionsTypes";
import { Avatar, Text, Button, Card, IconButton } from "react-native-paper";

export type CartProductViewProps = {
    product: ProductCollectionData;
    quantity: number;
    onEdit: (quantity: number) => void;
    onDelete: () => void;
};

export const CartProductView = (props: CartProductViewProps) => {
    const { quantity, product, onEdit, onDelete } = props;
    const { name, price, discount, promotion, image } = product;

    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [finalPrice, setFinalPrice] = useState(
        price -
            (discount !== "none"
                ? discount === "percentage"
                    ? (price * promotion) / 100
                    : promotion
                : 0)
    );
    const [subtotal, setSubtotal] = useState(finalPrice * localQuantity);

    useEffect(() => {
        setFinalPrice(
            price -
                (discount !== "none"
                    ? discount === "percentage"
                        ? (price * promotion) / 100
                        : promotion
                    : 0)
        );
        setSubtotal(finalPrice * localQuantity);
    }, [product, localQuantity]);

    return (
        <View>
            <Card>
                <Card.Title
                    title={name}
                    subtitle={
                        "$" +
                        finalPrice +
                        "| " +
                        (discount !== "none" &&
                            "Descuento de " +
                                (discount === "percentage"
                                    ? promotion + "%"
                                    : "$" + promotion))
                    }
                    left={(props) => (
                        <Avatar.Image
                            {...props}
                            size={50}
                            source={{
                                uri: image[0].replace(
                                    "127.0.0.1",
                                    "192.168.0.12"
                                ),
                            }}
                        />
                    )}
                />
                <Card.Actions>
                    <>
                        <IconButton
                            style={{ flex: 1 }}
                            icon="minus-circle"
                            size={20}
                            iconColor={colors.secondary}
                            onPress={() => {
                                const actual = localQuantity;
                                if (localQuantity > 1) {
                                    setLocalQuantity(actual - 1);
                                    onEdit(actual - 1);
                                }
                            }}
                        />
                        <Text style={{ flex: 1 }}>{quantity}</Text>
                        <IconButton
                            style={{ flex: 1 }}
                            icon="plus-circle"
                            size={20}
                            iconColor={colors.primary}
                            onPress={() => {
                                const actual = localQuantity;
                                if (localQuantity < 999) {
                                    setLocalQuantity(actual + 1);
                                    onEdit(actual + 1);
                                }
                            }}
                        />
                        <Text style={{ flex: 8 }}>Subtotal ${subtotal}</Text>
                        <IconButton
                            style={{ flex: 1 }}
                            icon="delete"
                            size={20}
                            iconColor={colors.secondary}
                            onPress={() => onDelete && onDelete()}
                        />
                    </>
                </Card.Actions>
            </Card>
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
