import React, { useState } from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    UseControllerProps,
} from "react-hook-form";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import {
    HelperText,
    IconButton,
    RadioButton,
    TextInput,
    TouchableRipple,
} from "react-native-paper";
import { colors } from "@feria-a-ti/common/theme/base";
import { AccountDirection } from "@feria-a-ti/common/model/account/editAccountFields";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

interface Props<T> extends UseControllerProps<T> {
    direction: AccountDirection;
    style?: any;
    hidden?: boolean;
    error?: FieldError | undefined;
    isSelected: boolean;
    onPress?: (direction: AccountDirection) => void;
}

const DirectionButtonComponent = <T extends FieldValues>({
    name,
    style,
    control,
    rules,
    error,
    direction,
    isSelected,
    onPress,
}: Props<T>) => {
    return (
        <>
            <TouchableRipple
                style={{
                    display: "flex",
                    backgroundColor: colors.light,
                    alignContent: "center",
                    borderWidth: 1,
                    borderRadius: 15,
                    borderColor: colors.primaryShadow,
                }}
                onPress={() => onPress(direction)}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                        marginBottom: 10,
                        alignContent: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            justifyContent: "center",
                            marginRight: 10,
                        }}
                    >
                        <RadioButton
                            onPress={() => false}
                            value="first"
                            status={isSelected ? "checked" : "unchecked"}
                        />
                    </View>
                    <View>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "center",
                                fontWeight: "bold",
                                marginTop: 5,
                                color: colors.primaryShadow,
                            }}
                        >
                            {direction.street} #{direction.streetNumber}
                        </Text>
                        <Text
                            style={{
                                flex: 1,
                                textAlign: "center",
                                marginBottom: 5,
                                color: colors.primaryShadow,
                            }}
                        >
                            {regionCode[direction.region - 1][1]}
                            {", "}
                            {
                                regionCommune[direction.region].find(
                                    (commune: [number, string]) =>
                                        (commune[0] as number) ==
                                        direction.commune
                                )[1]
                            }
                        </Text>
                    </View>
                </View>
            </TouchableRipple>
        </>
    );
};

const styles = StyleSheet.create({
    labelWrapper: {
        alignItems: "center",
        marginTop: "-2%",
        flexDirection: "row",
    },
    label: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        alignSelf: "flex-start",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 15,
        paddingHorizontal: "5%",
        borderRadius: 10,
    },
    input: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        marginTop: "2%",
        height: 40,
        marginHorizontal: 0,
        borderRadius: 50,
    },
});

export default DirectionButtonComponent;
