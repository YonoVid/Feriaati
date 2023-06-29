import "react-native-get-random-values";
import React, { useEffect, useState } from "react";

import { StyleSheet } from "react-native";
import { colors } from "@feria-a-ti/common/theme/base";

import {
    ProductCollectionData,
    ProductData,
} from "@feria-a-ti/common/model/functionsTypes";
import { Avatar, Text, Button, Card, IconButton } from "react-native-paper";

export type ProductViewProps = {
    product: ProductData;
    isEditable: boolean;
    addProduct?: (data: ProductCollectionData, quantity: number) => void;
    onEdit?: (product: ProductData) => void;
    onDelete?: (id: string) => void;
};

export const ProductView = (props: ProductViewProps) => {
    const { product, isEditable, addProduct, onEdit, onDelete } = props;
    const { id, name, description, price, discount, promotion, image } =
        props.product;

    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

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
        console.log("IMAGES::", image);
        console.log(
            "TEST REPLACE::",
            image[imageIndex].replace("127.0.0.1", "192.168.0.12")
        );
    }, []);

    const finalPrice =
        price -
        (discount !== "none"
            ? discount === "percentage"
                ? (price * promotion) / 100
                : promotion
            : 0);

    return (
        <Card>
            <Card.Title
                title={name}
                subtitle={"$" + finalPrice}
                left={(props) => (
                    <Avatar.Image
                        {...props}
                        size={50}
                        source={{
                            uri: image[imageIndex].replace(
                                "127.0.0.1",
                                "192.168.0.12"
                            ),
                        }}
                    />
                )}
            />
            {expanded && (
                <>
                    <Card.Content>
                        <Text>
                            {discount !== "none" &&
                                "Descuento de " +
                                    (discount === "percentage"
                                        ? promotion + "%"
                                        : "$" + promotion)}
                        </Text>
                        <Text>{description}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <IconButton icon="heart" size={20} onPress={() => {}} />
                        <IconButton
                            icon="share-variant-outline"
                            size={20}
                            onPress={() => {}}
                        />
                    </Card.Actions>
                </>
            )}
            <Card.Actions>
                <IconButton
                    icon={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    onPress={() => handleExpandClick()}
                />
                {isEditable ? (
                    <>
                        <IconButton
                            icon="pencil"
                            size={20}
                            onPress={() => onEdit(product)}
                        />
                        <IconButton
                            icon="delete"
                            size={20}
                            onPress={() => onDelete(product.id)}
                        />
                    </>
                ) : (
                    <>
                        <IconButton
                            icon="minus-circle"
                            size={20}
                            iconColor={colors.secondary}
                            onPress={() =>
                                quantity > 1 && setQuantity(quantity - 1)
                            }
                        />
                        <Text>{quantity}</Text>
                        <IconButton
                            icon="plus-circle"
                            size={20}
                            iconColor={colors.primary}
                            onPress={() =>
                                quantity < 999 && setQuantity(quantity + 1)
                            }
                        />
                        <Button
                            color="primary"
                            mode="contained-tonal"
                            onPress={() =>
                                addProduct && addProduct(product, quantity)
                            }
                        >
                            Comprar
                        </Button>
                    </>
                )}
            </Card.Actions>
        </Card>
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
