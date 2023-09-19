import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

import { Button, Card, DataTable, TouchableRipple } from "react-native-paper";
import { FactureView } from "./factureView";
import { useAppContext } from "../../app/AppContext";
import { colors } from "@feria-a-ti/common/theme/base";
import CommentForm from "../forms/CommentForm";
import { RFacturesListProps } from "@feria-a-ti/common/model/props/facturesListProps";

export const FactureList = (props: RFacturesListProps) => {
    // Context variables
    const { authUser, authToken, setMessage } = useAppContext();

    const { userId, label, factures, loadSize, color, children, loadData } =
        props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const pageSize = loadSize || 10;

    // Stored variables
    const [filter, setFilter] = useState<string | null>();
    const [selectedFacture, setSelectedFacture] = useState<FactureData>();

    const [page, setPage] = useState(0);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        if (value * pageSize >= factures.length && loadData != undefined) {
            loadData(factures.length);
        }
        setPage(value);
    };

    const getList = (): FactureData[] => {
        if (filter && filter != null && filter != "" && factures.length != 0) {
            return factures.filter((value: any) =>
                value.name.toUpperCase().includes(filter.toUpperCase())
            );
        }
        return factures || [];
    };
    return (
        <View style={styles.container}>
            <Card style={{ margin: 1, padding: 5 }}>
                {getList()
                    .slice(page * 3, (page + 1) * 3)
                    .map((facture, index) => (
                        <TouchableRipple
                            style={{
                                flex: 1,
                                alignContent: "center",
                                borderWidth: 1,
                                borderRadius: 15,
                                borderColor: colors.primaryShadow,
                            }}
                            onPress={() => setSelectedFacture(facture)}
                        >
                            <>
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        fontWeight: "bold",
                                        marginTop: 5,
                                        color: colors.primaryShadow,
                                    }}
                                >
                                    {new Date(
                                        facture.date.seconds * 1000
                                    ).toISOString()}
                                </Text>
                                <Text
                                    style={{
                                        flex: 1,
                                        textAlign: "center",
                                        marginBottom: 5,
                                        color: colors.primaryShadow,
                                    }}
                                >
                                    {"\n"}
                                    {facture.id}
                                </Text>
                            </>
                        </TouchableRipple>
                    ))}
                <DataTable.Pagination
                    page={page}
                    numberOfPages={
                        factures ? Math.floor(factures.length / 3) + 1 : 1
                    }
                    onPageChange={(page) => page >= 0 && setPage(page)}
                    label={`${page * 3 + 1}-${(page + 1) * 3} of ${
                        factures.length
                    }`}
                    showFastPaginationControls
                    numberOfItemsPerPage={3}
                />
            </Card>
            <View style={{ flexDirection: "column" }}>
                {selectedFacture != undefined && selectedFacture != null ? (
                    <FactureView
                        color={color || ""}
                        vendorId={userId}
                        facture={selectedFacture}
                    />
                ) : (
                    <Text style={{ ...styles.title, flex: 6 }}>
                        No hay factura seleccionada
                    </Text>
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
        paddingTop: 0,
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
