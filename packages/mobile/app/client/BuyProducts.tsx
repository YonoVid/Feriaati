import React, { useEffect, useState } from "react";
import { StackActions } from "@react-navigation/native";
import { Card } from "react-native-paper";
import WebView from "react-native-webview";
import { Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
    Environment,
} from "transbank-sdk";

import { colors } from "@feria-a-ti/common/theme/base";

import { callPayment } from "@feria-a-ti/common/functions/paymentFunctions";
import { BUYERROR } from "@feria-a-ti/common/model/users/buyTypes";
import {
    AccountData,
    ProductFactureData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    BuyProductFormFields,
    FactureTypes,
    ProductFactureFields,
} from "@feria-a-ti/common/model/fields/buyingFields";

import { BuyForm } from "@feria-a-ti/mobile/components/forms/BuyForm";
import { useAppContext } from "../AppContext";
import { errorCodes } from "@feria-a-ti/common/constants/errors";
import { checkBuyProduct } from "@feria-a-ti/common/check/checkBuyProduct";

export interface BuyProductsProps {
    navigation: NavigationProp<ParamListBase>;
    accountData: AccountData;
    vendorCheck: BUYERROR;
    priceTotal: number;
    productPetition: {
        [id: string]: ProductFactureData[];
    };
    response: { token: string; url: string };
    setResponse: (data: { token: string; url: string }) => void;
    canSubmit: boolean;
    setCanSubmit: (data: boolean) => void;
}

function BuyProducts(props: BuyProductsProps) {
    const {
        navigation,
        accountData,
        vendorCheck,
        priceTotal,
        productPetition,
        response,
        setResponse,
        canSubmit,
        setCanSubmit,
    } = props;

    // Context variables
    const { authToken, setMessage, resetProduct } = useAppContext();

    const returnUrl = "https://localhost";

    const [localCanSubmit, setLocalCanSubmit] = useState<boolean>(true);

    const onSubmit = (data: BuyProductFormFields) => {
        console.log("ACTUAL RESPONSE::", response);

        const formatedData: ProductFactureFields = {
            direction: data.direction || undefined,
            token: authToken as string,
            products: productPetition || {},
        };
        setCanSubmit(false);
        setLocalCanSubmit(false);
        // Generate facture
        if (checkBuyProduct(formatedData)) {
            const buyProductUser = httpsCallable<
                ProductFactureFields,
                ResponseData<string>
            >(functions, "buyProductUser");
            buyProductUser(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    if (!error) {
                        //setIsLogged(result.data as any);

                        console.log("TRANSBANK TEST::");

                        const amount = priceTotal;
                        const sessionId = data.token + "-" + extra;

                        const tx = new WebpayPlus.Transaction(
                            new Options(
                                IntegrationCommerceCodes.WEBPAY_PLUS,
                                IntegrationApiKeys.WEBPAY,
                                Environment.Integration
                            )
                        );
                        tx.create(extra, sessionId, amount, returnUrl)
                            .then((newResponse) => {
                                console.log("RESPONSE::", newResponse);
                                if (
                                    newResponse != undefined ||
                                    newResponse != null
                                ) {
                                    setResponse(newResponse);
                                    console.log("::LOAD SHIT::");
                                } else {
                                    setMessage({
                                        msg: "Problemas al realizar transacción",
                                        isError: true,
                                    });
                                }
                            })
                            .finally(() => {
                                setCanSubmit(true);
                                setLocalCanSubmit(true);
                            });
                    } else {
                        setMessage({ msg, isError: error });
                        setCanSubmit(true);
                        setLocalCanSubmit(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setCanSubmit(true);
                    setLocalCanSubmit(true);
                });
        }
    };

    return (
        <ScrollView
            style={styles.containerGlobal}
            contentContainerStyle={styles.innerContainer}
        >
            {response == null || response == undefined ? (
                <Card style={styles.containerVendor}>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {"Realizar pago"}
                    </Text>
                    <BuyForm
                        account={accountData}
                        canSubmit={
                            localCanSubmit &&
                            canSubmit &&
                            vendorCheck == BUYERROR.NONE &&
                            priceTotal != 0
                        }
                        onSubmit={(data) => {
                            console.log(data);
                            onSubmit(data);
                        }}
                    />
                </Card>
            ) : (
                <WebView
                    source={{
                        uri: response.url,
                        body: "token_ws=" + response.token,
                        method: "POST",
                    }}
                    onMessage={this.onMessage}
                    onNavigationStateChange={(getUrl) => {
                        console.log("getUrl", getUrl);
                        if (getUrl.url.includes(returnUrl)) {
                            navigation.dispatch(
                                StackActions.replace("factureStatus", {
                                    token_ws: response.token,
                                    type: FactureTypes.PRODUCTS,
                                })
                            );
                        }
                    }}
                />
            )}
        </ScrollView>
    );
}

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

export default BuyProducts;
