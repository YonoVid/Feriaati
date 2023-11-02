import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";

import { Button, ProgressBar } from "react-native-paper";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
    Environment,
} from "transbank-sdk";

import { colors } from "@feria-a-ti/common/theme/base";
import {
    FactureStatus,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { TransbankTransaction } from "@feria-a-ti/common/model/account/paymenTypes";
import {
    FactureTypes,
    UpdateFactureFields,
} from "@feria-a-ti/common/model/fields/buyingFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";

import { useAppContext } from "../AppContext";

export interface FactureResultProps {
    route: { params: any };
    navigation: NavigationProp<ParamListBase>;
}

export const FactureResult = (props: FactureResultProps) => {
    // Context variables
    const { authToken, resetProduct, setMessage } = useAppContext();
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
        if (
            token_ws &&
            token_ws != "" &&
            Object.values<string>(FactureTypes).includes(type as string)
        ) {
            const tx = new WebpayPlus.Transaction(
                new Options(
                    IntegrationCommerceCodes.WEBPAY_PLUS,
                    IntegrationApiKeys.WEBPAY,
                    Environment.Integration
                )
            );
            tx.commit(token_ws)
                .then((value: TransbankTransaction) => {
                    console.log("TOKEN RESPONSE::", value);

                    setTransaction(value);

                    if (value != undefined && value != null) {
                        let status = FactureStatus.NEGATED;
                        if (value.response_code == 0) {
                            resetProduct();
                            status = FactureStatus.APPROVED;
                        }

                        const updateFacture = httpsCallable<
                            UpdateFactureFields,
                            ResponseData<string>
                        >(functions, "updateUserFacture");

                        const formatedData: UpdateFactureFields = {
                            token: authToken as string,
                            facture: value.buy_order,
                            status: status,
                            type: type as FactureTypes,
                        };

                        console.log(formatedData);

                        updateFacture(formatedData)
                            .then((result) => {
                                const { msg, error } = result.data;
                                console.log(result);
                                //Show alert message
                                setMessage({ msg, isError: error });
                            })
                            .catch((error) => {
                                console.log(error);
                                setMessage({
                                    msg: messagesCode["ERR00"],
                                    isError: error,
                                });
                            });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
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
