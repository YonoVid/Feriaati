import "react-native-get-random-values";
import React, { useEffect, useState } from "react";

import { Text, Image, View, StyleSheet } from "react-native";
import { colors } from "@feria-a-ti/common/theme/base";

import { ProductData } from "@feria-a-ti/common/model/functionsTypes";
import { Avatar } from "react-native-paper";

export type ProductViewProps = {
    product: ProductData;
    isEditable: boolean;
    onEdit?: (product: ProductData) => void;
    onDelete?: (id: string) => void;
};

export const ProductView = (props: ProductViewProps) => {
    const { isEditable, onEdit, onDelete } = props;
    const { id, name, description, price, discount, promotion, image } =
        props.product;

    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        setInterval(() => {
            let newIndex = imageIndex + 1;
            while (!image[newIndex] || image[newIndex] === "") {
                newIndex = newIndex + 1 > image.length - 1 ? 0 : newIndex + 1;
            }
            setImageIndex(newIndex);
        }, 3000);
    }, []);

    const finalPrice =
        price -
        (discount !== "none"
            ? discount === "percentage"
                ? (price * promotion) / 100
                : promotion
            : 0);

    console.log("IMAGES::", image);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {name != null ? name : "Productos"}
            </Text>
            <Image
                source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
            ></Image>
            <Avatar.Image source={{ uri: image[imageIndex] }}></Avatar.Image>
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
