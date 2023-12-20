import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { Button, ProgressBar } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";

import { TransbankTransaction } from "@feria-a-ti/common/model/account/paymenTypes";

import { useAppContext } from "../AppContext";
import {
    FactureStatusFields,
    getFactureStatus,
} from "@feria-a-ti/common/functions/factureFunctions";

export interface FactureResultProps {
    route: { params: any };
    navigation: NavigationProp<ParamListBase>;
}

export const FactureResult = (props: FactureResultProps) => {
    // Context variables
    const {
        authToken,
        type: authType,
        resetProduct,
        setMessage,
    } = useAppContext();
    // Navigation
    const { route, navigation } = props;
    const { token_ws, type } = route.params;
    // Form variables
    const [canSubmit, setCanSubmit] = useState(false);

    // Transaction data
    const [transaction, setTransaction] = useState<
        TransbankTransaction | undefined
    >();
    // Url query data getter

    useEffect(() => {
        console.log("TOKEN_WS::" + token_ws);
        console.log("TYPE::" + type);

        const formatedData: FactureStatusFields = {
            token: authToken as string,
            type: type,
            transactionToken: token_ws as string,
            factureType: type as string,
        };

        getFactureStatus(
            { formatedData, setCanSubmit, setMessage },
            (value: TransbankTransaction) => {
                setTransaction(value);

                if (value.response_code == 0) {
                    resetProduct();
                }
            }
        );
    }, []);

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <View style={styles.container}>
                    <Text style={styles.title}>HEY</Text>
                    {transaction == undefined ? (
                        <ProgressBar
                            color={colors.primaryShadow}
                            indeterminate
                        />
                    ) : (
                        <View>
                            {transaction != undefined &&
                            transaction.response_code == 0 ? (
                                <>
                                    <Text>Transacción exitosa</Text>
                                    {/* <Icon
                                        source="camera"
                                        color={colors.secondaryShadow}
                                        size={20}
                                    /> */}
                                </>
                            ) : (
                                <>
                                    <Text>Transacción fallida,</Text>
                                    <Text>vuelva a intentarlo más tarde</Text>
                                    {/* <Icon
                                        source="camera"
                                        color={colors.light}
                                        size={20}
                                    /> */}
                                </>
                            )}
                        </View>
                    )}
                    <View style={styles.button}>
                        <Button
                            mode="contained"
                            color={styles.buttonInner.color}
                            disabled={!canSubmit}
                            onPress={() => navigation.navigate("session")}
                        >
                            {"Volver al inicio"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
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
