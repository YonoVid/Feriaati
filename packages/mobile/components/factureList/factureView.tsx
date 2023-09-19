import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";

import { colors } from "@feria-a-ti/common/theme/base";
import {
    FactureData,
    UserComment,
} from "@feria-a-ti/common/model/functionsTypes";

import {
    Avatar,
    Text,
    Button,
    Card,
    IconButton,
    Divider,
    DataTable,
} from "react-native-paper";

export type FactureViewProps = {
    color: string;
    facture: FactureData;
    vendorId?: string;
    // sx?: SxProps<Theme>;
};

export const FactureView = (props: FactureViewProps) => {
    const { color, facture, vendorId } = props;
    const { id, products } = facture;

    const [finalPrice, setFinalPrice] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        if (products.length > 0) {
            let value = 0;
            products.forEach((product) => {
                value += product.subtotal;
            });
            setFinalPrice(value);
        }
    }, [products]);

    return (
        <Card>
            <Card.Content>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Nombre</DataTable.Title>
                        <DataTable.Title numeric>Cantidad</DataTable.Title>
                        <DataTable.Title>Precio</DataTable.Title>
                        <DataTable.Title>Subtotal</DataTable.Title>
                    </DataTable.Header>

                    {products.map((product, index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{product.name}</DataTable.Cell>
                            <DataTable.Cell numeric>
                                {product.quantity}
                            </DataTable.Cell>
                            <DataTable.Cell>
                                {"$" + product.subtotal / product.quantity}
                            </DataTable.Cell>
                            <DataTable.Cell>
                                {"$" + product.subtotal}
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
                <View>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {"TOTAL: $" + finalPrice}
                    </Text>
                </View>
            </Card.Content>
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
