import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { Controller, FieldError, useForm } from "react-hook-form";
import { Button, IconButton } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { REditAccountFormProps } from "@feria-a-ti/common/model/account/editAccountFormProps";
import {
    AccountDirection,
    EditFormAccountFields,
} from "@feria-a-ti/common/model/account/editAccountFields";
import {
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
} from "@feria-a-ti/common/check/checkBase";
import { phoneFormatRegex } from "@feria-a-ti/common/check/checkAccountFields";

import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import DropdownComponent from "@feria-a-ti/mobile/components/inputs/DropdownComponent";
import FileInputComponent from "../inputs/FileInputComponent";

function EditAccountForm(props: REditAccountFormProps) {
    const { account, children, onSubmit } = props;
    const { watch, handleSubmit, setValue, control } =
        useForm<EditFormAccountFields>();

    const [userDirections, setUserDirections] = useState<
        Array<AccountDirection>
    >([]);

    const addDirectionField = () => {
        const newValue = userDirections.concat({
            street: "",
            streetNumber: NaN,
            region: NaN,
            commune: NaN,
        });
        setUserDirections(newValue);
    };

    const removeDirectionField = (index: number) => {
        const newValue = userDirections.filter(
            (value, valueIndex, valueArray) => index !== valueIndex
        );
        setUserDirections(newValue);
    };

    useEffect(() => {
        if (account && account !== null) {
            setValue("email", account.email);
            account.phone && setValue("phone", account.phone);
            if (account.direction) {
                setValue("direction", account.direction);
                setUserDirections(account.direction);
            }
        }
    }, [account]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Información de la cuenta</Text>
            <InputComponent
                name="email"
                label="Correo electrónico"
                control={control}
                rules={{
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: emailFormatRegex,
                        message:
                            "El formato debe ser, por ejemplo: ejemplo@correo.cl",
                    },
                }}
            />
            <InputComponent
                name="password"
                label="Contraseña"
                type="password"
                control={control}
                rules={{
                    minLength: {
                        value: 8,
                        message: "El mínimo de caracteres es 8",
                    },
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: passwordFormatRegex,
                        message:
                            "La contraseña debe ser alfanumérica\n(contener una letra y un número)",
                    },
                }}
            />
            <InputComponent
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                control={control}
                rules={{
                    validate: {
                        confirmPassword: (value) =>
                            watch("password") == null ||
                            watch("password")?.toString() === value ||
                            watch("password")?.toString() === "" ||
                            "Las contraseñas deben ser iguales",
                    },
                }}
            />
            <InputComponent
                name="phone"
                label="Teléfono (opcional)"
                type="text"
                control={control}
                rules={{
                    minLength: {
                        value: 7,
                        message: "El mínimo de caracteres es 7",
                    },
                    maxLength: {
                        value: 15,
                        message: "El máximo de caracteres es 15",
                    },
                    pattern: {
                        value: phoneFormatRegex,
                        message: "El formato debe ser como: +56911111111",
                    },
                }}
            />

            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={
                        props.canSubmit != null ? !props.canSubmit : false
                    }
                    onPress={() => addDirectionField()}
                >
                    Añadir dirección
                </Button>
            </View>
            {userDirections?.map((value, index, array) => (
                <View key={`direction.${index}`}>
                    <DropdownComponent
                        key={`direction.${index}.region`}
                        name={`direction.${index}.region`}
                        label="Región"
                        defaultValue={value.region}
                        control={control}
                        rules={{
                            required: "La región es requerida",
                        }}
                        list={regionCode}
                    />
                    <DropdownComponent
                        key={`direction.${index}.commune`}
                        name={`direction.${index}.commune`}
                        label="Comuna"
                        defaultValue={value.commune}
                        control={control}
                        rules={{
                            required: "La comuna es requerida",
                        }}
                        list={
                            regionCommune[watch(`direction.${index}.region`)] ||
                            []
                        }
                    />
                    <InputComponent
                        key={`direction.${index}.street`}
                        name={`direction.${index}.street`}
                        label="Calle"
                        control={control}
                        rules={{
                            required: "La calle es requerida",
                            maxLength: {
                                value: 128,
                                message: "El máximo de caracteres es 128",
                            },
                        }}
                    />
                    <InputComponent
                        key={`direction.${index}.streetNumber`}
                        name={`direction.${index}.streetNumber`}
                        label="Número de la calle"
                        control={control}
                        rules={{
                            required: "El número de calle es requerido",
                            maxLength: {
                                value: 128,
                                message: "El máximo de caracteres es 128",
                            },
                            pattern: {
                                value: numberRegex,
                                message: "Valor debe ser numérico",
                            },
                        }}
                    />
                    <IconButton
                        style={{ flex: 1 }}
                        containerColor={colors.light}
                        icon="cancel"
                        size={20}
                        onPress={() => removeDirectionField(index)}
                    />
                </View>
            ))}

            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={!props.canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    Actualizar datos de cuenta
                </Button>
            </View>
        </View>
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
});

export default EditAccountForm;
