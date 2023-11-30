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
    SubscriptionData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    BuyProductFormFields,
    FactureTypes,
    ProductFactureFields,
} from "@feria-a-ti/common/model/fields/buyingFields";

import { BuyForm } from "@feria-a-ti/mobile/components/forms/BuyForm";
import { useAppContext } from "../AppContext";
import { errorCodes, messagesCode } from "@feria-a-ti/common/constants/errors";
import { checkBuyProduct } from "@feria-a-ti/common/check/checkBuyProduct";
import {
    SubscriptionFields,
    SubscriptionFormFields,
} from "@feria-a-ti/common/model/account/subscriptionAccountFields";
import { FieldValues } from "react-hook-form";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { checkGetAccountFields } from "@feria-a-ti/common/check/checkAccountFields";
import { SubscriptionForm } from "../../components/forms/SubscriptionForm";

export interface SubscriptionAccountProps {
    navigation: NavigationProp<ParamListBase>;
}

function SubscriptionAccount(props: SubscriptionAccountProps) {
    const { navigation } = props;

    // Context variables
    const { authToken, emailUser, type, setMessage, resetProduct } =
        useAppContext();

    const returnUrl = "https://localhost";

    const [canSubmit, setCanSubmit] = useState(false);

    const [subscriptionData, setSubscriptionData] =
        useState<SubscriptionData>();

    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        getSubscriptionData();
    }, []);

    const getSubscriptionData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            email: emailUser,
            type: type,
        };
        const check = checkGetAccountFields(formatedData);

        console.log("ERROR CHECK::", check);

        if (check) {
            //Lock register button
            setCanSubmit(false);
            //Call firebase function to create user
            const getAccount = httpsCallable<
                GetAccountFields,
                ResponseData<SubscriptionData>
            >(functions, "getAccountSubscription");
            getAccount(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    setSubscriptionData(extra);
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    const onSubmit = (data: SubscriptionFormFields) => {
        const formatedData: SubscriptionFields = {
            type: type,
            email: emailUser,
            token: authToken as string,
            amount: data.amount,
            months: data.months,
        };
        console.log("DATA::", formatedData);
        // Generate facture
        if (canSubmit && subscriptionData && subscriptionData != null) {
            setCanSubmit(false);
            const buyProductUser = httpsCallable<
                SubscriptionFields,
                ResponseData<string>
            >(functions, "setAccountSubscription");
            buyProductUser(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setMessage({ msg, isError: error });
                    if (!error) {
                        resetProduct();
                        //setIsLogged(result.data as any);

                        console.log("TRANSBANK TEST::");

                        const amount = formatedData.amount;
                        const sessionId = authToken + "-" + extra;

                        const tx = new WebpayPlus.Transaction(
                            new Options(
                                IntegrationCommerceCodes.WEBPAY_PLUS,
                                IntegrationApiKeys.WEBPAY,
                                Environment.Integration
                            )
                        );
                        tx.create(extra, sessionId, amount, returnUrl)
                            .then((newResponse) => {
                                setResponse(newResponse);
                            })
                            .finally(() => setCanSubmit(true));
                    }
                })
                .finally(() => setCanSubmit(true));
        } else {
            setMessage({ msg: "Datos de pedido incorrectos", isError: true });
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
                        {"Estado de subscripción"}
                    </Text>
                    <SubscriptionForm
                        subscription={subscriptionData}
                        canSubmit={canSubmit}
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
                                    type: FactureTypes.SUBSCRIPTION,
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

export default SubscriptionAccount;
