import "react-native-get-random-values";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

import { ListContributorProps } from "@feria-a-ti/common/model/contributors/listContributorProps";

import { colors } from "@feria-a-ti/common/theme/base";

import { DataTable } from "react-native-paper";
import { ContributorView } from "./contributorView";

export const ContributorList = (props: ListContributorProps) => {
    const {
        label,
        color,
        children,
        contributors,
        isAdding,
        onAdd,
        onEdit,
        onDelete,
    } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(0);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(event);
        setPage(value);
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={{ flexDirection: "row" }}>
                    <DataTable.Pagination
                        style={{ flex: 10 }}
                        page={page}
                        numberOfPages={Math.floor(contributors.length / 3) + 1}
                        onPageChange={(page) => page >= 0 && setPage(page)}
                        label={`${page * 3 + 1}-${(page + 1) * 3} of ${
                            contributors.length
                        }`}
                        showFastPaginationControls
                        numberOfItemsPerPage={3}
                    />
                </View>
            </View>
            {!isAdding && (
                <Button mode="contained-tonal" onPress={onAdd}>
                    {"Añadir producto"}
                </Button>
            )}
            <View style={{ flexDirection: "column" }}>
                {contributors
                    .slice(page * 3, (page + 1) * 3)
                    .map((contributor, index) => (
                        <ContributorView
                            contributor={contributor}
                            onEdit={() => onEdit(contributor)}
                            onDelete={() => onDelete(contributor.id)}
                            key={contributor.name + index}
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
