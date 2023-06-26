import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";
import { RProductListProps } from "@feria-a-ti/common/model/props/productListProps";
import { Link } from "expo-router";
import { ProductData } from "@feria-a-ti/common/model/functionsTypes";
import { Avatar, DataTable, IconButton } from "react-native-paper";
import { ProductView } from "./ProductView";

export const ProductList = (props: RProductListProps) => {
    const {
        label,
        color,
        children,
        products,
        filter,
        isEditable,
        onAdd,
        onEdit,
        onDelete,
        onReload,
        onSubmit,
    } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        const mockupProduct: ProductData = {
            id: "mockup",
            name: "Test",
            description: "Is a test of product views",
            price: 1000,
            discount: "none",
            promotion: 400,
            image: [
                "https://reactnative.dev/img/tiny_logo.png",
                "https://reactnative.dev/img/tiny_logo.png",
                "https://reactnative.dev/img/tiny_logo.png",
            ],
        };
        products.length === 0 && products.push(mockupProduct);
    }, []);

    const getList = (): ProductData[] => {
        if (filter && filter != null && filter != "") {
            return products.filter((value) =>
                value.name.toUpperCase().includes(filter.toUpperCase())
            );
        }
        return products;
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row" }}>
                <DataTable.Pagination
                    style={{ flex: 10 }}
                    page={page}
                    numberOfPages={Math.floor(products.length / 3) + 1}
                    onPageChange={(page) => page >= 0 && setPage(page)}
                    label={`${page * 3 + 1}-${(page + 1) * 3} of ${
                        products.length
                    }`}
                    showFastPaginationControls
                    numberOfItemsPerPage={3}
                />
                {onReload && (
                    <IconButton
                        style={{ flex: 1 }}
                        containerColor={colors.light}
                        icon="refresh"
                        size={20}
                        onPress={onReload}
                    />
                )}
            </View>
            <Button mode="contained-tonal" onPress={onAdd}>
                {"Añadir producto"}
            </Button>
            <View style={{ flexDirection: "column" }}>
                {getList()
                    .slice(page * 3, (page + 1) * 3)
                    .map((product, index) => (
                        <ProductView
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isEditable={isEditable}
                            key={product.name + index}
                            product={product}
                        />
                    ))}
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
