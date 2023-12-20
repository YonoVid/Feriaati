import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { FactureData } from "@feria-a-ti/common/model/functionsTypes";
import { FactureFields } from "@feria-a-ti/common/model/fields/factureFields";

import { colors } from "@feria-a-ti/common/theme/base";

import { getVendorFactures } from "@feria-a-ti/common/functions/factureFunctions";

import { FactureList } from "@feria-a-ti/mobile/components/factureList/factureList";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface FacturesVendorProps {
    navigation: NavigationProp<ParamListBase>;
}

export const FacturesVendor = (props: FacturesVendorProps) => {
    // Context variables
    const { authUser, authToken, emailUser, setMessage, resetProduct } =
        useAppContext();
    // Context variables
    const { products } = useAppContext();
    // UI variable
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    // Retrived data
    const [factures, setFactures] = useState<Array<FactureData>>([]);

    const loadFactures = (index: number) => {
        console.log("LOAD FACTURES");
        const formatedData: FactureFields = {
            token: authToken as string,
            email: emailUser,
            index: index,
            size: 10,
        };

        getVendorFactures(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                setFactures && setFactures(factures.concat(data));
            }
        );
    };

    useEffect(() => {
        if (factures.length < 1) {
            loadFactures(0);
        }
    }, []);

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                <Card style={styles.containerVendor}>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {"Facturas"}
                    </Text>
                    {products && (
                        <FactureList
                            userId={authUser || "userId"}
                            factures={factures}
                            label="Facturas de compras"
                            loadData={loadFactures}
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
