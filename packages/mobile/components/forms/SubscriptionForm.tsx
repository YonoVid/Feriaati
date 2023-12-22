import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, IconButton, RadioButton } from "react-native-paper";

import {
    AccountDirection,
    FactureData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    BuyProductFormFields,
    BuyTransportOptions,
} from "@feria-a-ti/common/model/fields/buyingFields";
import { BuyProductFormProps } from "@feria-a-ti/common/model/props/buyProductFormProps";

import { colors } from "@feria-a-ti/common/theme/base";

import DirectionButtonComponent from "../inputs/DirectionButtonComponent";
import { numberRegex } from "@feria-a-ti/common/check/checkBase";
import InputComponent from "../inputs/InputComponent";
import DropdownComponent from "../inputs/DropdownComponent";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { SubscriptionFormProps } from "@feria-a-ti/common/model/props/subscriptionFormProps";
import { SubscriptionFormFields } from "@feria-a-ti/common/model/account/subscriptionAccountFields";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

export const SubscriptionForm = (props: SubscriptionFormProps) => {
    const { subscription, canSubmit, onSubmit } = props;
    const { watch, handleSubmit, setValue, reset, clearErrors, control } =
        useForm<SubscriptionFormFields>({
            defaultValues: { amount: 2000, months: 1 },
        });

    useEffect(() => {
        if (subscription && subscription !== null) {
            setValue("amount", subscription?.amountBase);
            setValue("months", 1);
        }
    }, [subscription, setValue]);

    return (
        <View style={{ ...styles.container, display: "flex" }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {subscription != undefined && subscription != null ? (
                    <>
                        <Text>Subscripcción actualmente válida hasta</Text>
                        <Text>
                            {subscription.expirationDate != undefined &&
                                subscription.expirationDate != null &&
                                new Date(
                                    subscription.expirationDate.seconds * 1000
                                ).toDateString()}
                        </Text>
                    </>
                ) : (
                    <Text>No existe una subscripcción actualmente válida</Text>
                )}
                <Controller
                    control={control}
                    name="months"
                    defaultValue={1}
                    render={({ field: { onChange, value } }) => (
                        <RadioButton.Group
                            onValueChange={(value) => {
                                if (value === "month") {
                                    setValue(
                                        "amount",
                                        subscription?.amountBase
                                    );
                                    setValue("months", 1);
                                } else if (value === "year") {
                                    setValue(
                                        "amount",
                                        subscription?.amountYear
                                    );
                                    setValue("months", 12);
                                }
                            }}
                            value={value == 1 ? "month" : "year"}
                        >
                            <RadioButton.Item
                                label="Subscripcción mensual"
                                value={"month"}
                            />
                            <RadioButton.Item
                                label="Subscripcción anual"
                                value={"year"}
                            />
                        </RadioButton.Group>
                    )}
                />
                {subscription != undefined && subscription != null ? (
                    <>
                        <Text>Costo de {watch("months") || 0} mes(es)</Text>
                        <Text>
                            $
                            {watch("months") == 1
                                ? numberWithCommas(subscription?.amountBase)
                                : numberWithCommas(subscription?.amountYear) +
                                  " (-" +
                                  ~~(
                                      ((subscription?.amountBase * 12 -
                                          subscription?.amountYear) /
                                          subscription?.amountBase) *
                                      12
                                  ) +
                                  "%)"}
                        </Text>
                    </>
                ) : (
                    <Text>No existe una subscripcción actualmente válida</Text>
                )}
            </View>
            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={!canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    {"Pagar"}
                </Button>
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
