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

export const BuyForm = (props: BuyProductFormProps) => {
    const { account, canSubmit, onSubmit } = props;
    const { watch, handleSubmit, setValue, reset, clearErrors, control } =
        useForm<BuyProductFormFields>({
            defaultValues: { shipping: BuyTransportOptions.DELIVERY },
        });

    const [userDirection, setUserDirection] = useState<Array<AccountDirection>>(
        []
    );

    const [addNewDirection, setAddNewDirection] = useState<boolean>(false);
    const [selectedDirection, setSelectedDirection] =
        useState<AccountDirection>();

    const addDirectionField = () => {
        if (!addNewDirection) {
            reset();
            setAddNewDirection(true);
            setSelectedDirection(undefined);
        }
    };

    const setDirection = (newDirection: AccountDirection) => {
        setValue("direction.region", newDirection.region);
        setValue("direction.commune", newDirection.commune);
        setValue("direction.street", newDirection.street);
        setValue("direction.streetNumber", newDirection.streetNumber);
        setValue("direction.extra", newDirection.extra);
        clearErrors();
        setAddNewDirection(false);
    };

    const resetDirection = () => {
        setValue("direction.region", undefined);
        setValue("direction.commune", undefined);
        setValue("direction.street", undefined);
        setValue("direction.streetNumber", undefined);
        setValue("direction.extra", undefined);
        setValue("direction", undefined);
        clearErrors();
    };

    const removeDirectionField = () => {
        console.log("REMOVE DIRECTION FIEEEEEELD");
        setAddNewDirection(false);
        if (account && account !== null && account.direction) {
            setSelectedDirection(account.direction[0]);
        }
    };

    useEffect(() => {
        if (account && account !== null && account.direction) {
            setUserDirection(account.direction);
            setDirection(account.direction[0]);
            setSelectedDirection(account.direction[0]);
            setAddNewDirection(false);
        } else {
            setAddNewDirection(true);
        }
    }, [account, setValue]);

    return (
        <View style={{ ...styles.container, display: "flex" }}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Controller
                    control={control}
                    name="shipping"
                    render={({ field: { onChange, value } }) => (
                        <RadioButton.Group
                            onValueChange={(value) => {
                                onChange(value);
                                if (value == BuyTransportOptions.RETIRE) {
                                    setValue("direction", undefined);
                                    if (
                                        account &&
                                        account !== null &&
                                        account.direction
                                    ) {
                                        removeDirectionField();
                                    } else {
                                        addDirectionField();
                                    }
                                } else if (
                                    value == BuyTransportOptions.DELIVERY
                                ) {
                                    resetDirection();
                                }
                            }}
                            value={value}
                        >
                            <RadioButton.Item
                                label="Envío a casa"
                                value={BuyTransportOptions.DELIVERY}
                            />
                            <RadioButton.Item
                                label="Retiro en tienda"
                                value={BuyTransportOptions.RETIRE}
                            />
                        </RadioButton.Group>
                    )}
                />
                {watch("shipping") == BuyTransportOptions.DELIVERY && (
                    <View>
                        {!addNewDirection ? (
                            <>
                                <Button
                                    mode="contained-tonal"
                                    color={styles.buttonInner.color}
                                    disabled={!canSubmit}
                                    onPress={() => addDirectionField()}
                                >
                                    {"Agregar dirección"}
                                </Button>
                                <Card style={{ display: "flex" }}>
                                    <ScrollView>
                                        {userDirection?.map((value, index) => (
                                            <DirectionButtonComponent
                                                name={"direction-" + index}
                                                key={index}
                                                direction={value}
                                                isSelected={
                                                    selectedDirection == value
                                                }
                                                onPress={(data) => {
                                                    setDirection(data);
                                                    setSelectedDirection(data);
                                                }}
                                            />
                                        ))}
                                    </ScrollView>
                                </Card>
                            </>
                        ) : (
                            <>
                                <DropdownComponent
                                    key={"region"}
                                    name={"direction.region"}
                                    label="Región"
                                    control={control}
                                    defaultValue={
                                        selectedDirection != null &&
                                        selectedDirection != undefined
                                            ? selectedDirection.region
                                            : undefined
                                    }
                                    rules={{
                                        required: "La región es requerida",
                                    }}
                                    list={regionCode}
                                />
                                <DropdownComponent
                                    key={"commune"}
                                    name={"direction.commune"}
                                    label="Comuna"
                                    control={control}
                                    defaultValue={
                                        selectedDirection != null &&
                                        selectedDirection != undefined
                                            ? selectedDirection.commune
                                            : undefined
                                    }
                                    rules={{
                                        required: "La comuna es requerida",
                                    }}
                                    list={
                                        regionCommune[
                                            watch("direction.region")
                                        ] || []
                                    }
                                />
                                <InputComponent
                                    key={"street"}
                                    name={"direction.street"}
                                    label="Calle"
                                    control={control}
                                    rules={{
                                        required: "La calle es requerida",
                                        maxLength: {
                                            value: 128,
                                            message:
                                                "El máximo de caracteres es 128",
                                        },
                                    }}
                                />
                                <InputComponent
                                    key={"streetNumber"}
                                    name={"direction.streetNumber"}
                                    label="Número de la calle"
                                    control={control}
                                    rules={{
                                        required:
                                            "El número de calle es requerido",
                                        maxLength: {
                                            value: 128,
                                            message:
                                                "El máximo de caracteres es 128",
                                        },
                                        pattern: {
                                            value: numberRegex,
                                            message: "Valor debe ser numérico",
                                        },
                                    }}
                                />
                                {userDirection.length > 0 && (
                                    <IconButton
                                        style={{ width: "100%" }}
                                        containerColor={colors.light}
                                        icon="cancel"
                                        size={20}
                                        onPress={() => removeDirectionField()}
                                    />
                                )}
                            </>
                        )}
                    </View>
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
