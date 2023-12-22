import React, { useState } from "react";
import { StackActions } from "@react-navigation/native";
import { Card } from "react-native-paper";
import WebView from "react-native-webview";
import { Text, StyleSheet, ScrollView } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { colors } from "@feria-a-ti/common/theme/base";

import { payProductsMobile } from "@feria-a-ti/common/functions/payment/paymentFunctions";
import { BUYERROR } from "@feria-a-ti/common/model/users/buyTypes";
import {
    AccountData,
    ProductFactureData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    BuyProductFormFields,
    FactureTypes,
    ProductFactureFields,
} from "@feria-a-ti/common/model/fields/buyingFields";

import { BuyForm } from "@feria-a-ti/mobile/components/forms/BuyForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

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

        payProductsMobile(
            {
                formatedData,
                returnUrl,
                setCanSubmit: (value: boolean) => {
                    setCanSubmit(value);
                    setLocalCanSubmit(value);
                },
                setMessage,
            },
            (value) => {
                if (value != undefined || value != null) {
                    setResponse(value);
                }
            }
        );
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
