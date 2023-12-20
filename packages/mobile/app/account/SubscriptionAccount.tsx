import React, { useEffect, useState } from "react";
import { StackActions } from "@react-navigation/native";
import { Card } from "react-native-paper";
import WebView from "react-native-webview";
import { Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { colors } from "@feria-a-ti/common/theme/base";

import { SubscriptionData } from "@feria-a-ti/common/model/functionsTypes";
import { FactureTypes } from "@feria-a-ti/common/model/fields/buyingFields";
import {
    SubscriptionFields,
    SubscriptionFormFields,
} from "@feria-a-ti/common/model/account/subscriptionAccountFields";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import {
    getSubscription,
    paySubscriptionWeb,
} from "@feria-a-ti/common/functions/payment/subscriptionFunctions";

import { SubscriptionForm } from "@feria-a-ti/mobile/components/forms/SubscriptionForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

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

        getSubscription(
            { formatedData, setCanSubmit, setMessage },
            (value: SubscriptionData) => {
                setSubscriptionData(value);
            }
        );
    };

    const onSubmit = (data: SubscriptionFormFields) => {
        const formatedData: SubscriptionFields = {
            type: type,
            email: emailUser,
            token: authToken as string,
            amount: data.amount,
            months: data.months,
        };
        if (canSubmit && subscriptionData && subscriptionData != null) {
            paySubscriptionWeb(
                { formatedData, returnUrl, setCanSubmit, setMessage },
                (data) => {
                    setResponse(data);
                }
            );
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
