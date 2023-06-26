import React, { useCallback, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { Controller, FieldError, useForm } from "react-hook-form";
import { Button } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";
import {
    checkRutVerificationCodeString,
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
    rutFormatRegex,
} from "@feria-a-ti/common/check/checkRegisterFields";
import { RegisterVendorFields } from "@feria-a-ti/common/model/fields/registerFields";
import { RRegisterVendorFormProps } from "@feria-a-ti/common/model/props/registerFormProps";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import DropdownComponent from "@feria-a-ti/mobile/components/inputs/DropdownComponent";
import FileInputComponent from "../inputs/FileInputComponent";

function RegisterVendorForm(props: RRegisterVendorFormProps) {
    const { setImageData, onSubmit } = props;
    const {
        setValue,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<RegisterVendorFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>REGISTER</Text>
            <InputComponent
                name="enterpriseName"
                label="Nombre de la empresa"
                control={control}
                error={errors?.enterpriseName}
                rules={{
                    required: "El nombre de la empresa es requerido",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                }}
            />
            <InputComponent
                name="localNumber"
                label="Número de local"
                control={control}
                error={errors?.localNumber}
                rules={{
                    required: "El número de local es requerido",
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
            <DropdownComponent
                name="region"
                label="Región"
                control={control}
                error={errors?.region}
                rules={{
                    required: "La región es requerida",
                }}
                list={regionCode}
            />
            <DropdownComponent
                name="commune"
                label="Comuna"
                control={control}
                error={errors?.commune}
                rules={{
                    required: "La comuna es requerida",
                }}
                list={regionCommune[watch("region")] || []}
            />
            <InputComponent
                name="street"
                label="Calle"
                control={control}
                error={errors?.street}
                rules={{
                    required: "La calle es requerida",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                }}
            />
            <InputComponent
                name="streetNumber"
                label="Número de la calle"
                control={control}
                error={errors?.streetNumber}
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

            <FileInputComponent
                name="image"
                type="image"
                control={control}
                label="Ingresar foto de local"
                error={errors?.image}
                rules={{
                    required: "La imagen del local es requerida",
                }}
                icon="camera"
                setData={setImageData}
            />
            <InputComponent
                name="rut"
                label="RUT"
                control={control}
                error={errors?.rut}
                rules={{
                    required: "El RUT es requerido",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: rutFormatRegex,
                        message: "El formato debe ser, por ejemplo: 11111111-1",
                    },
                    validate: (value) =>
                        checkRutVerificationCodeString(value as string) ||
                        "El formato debe ser, por ejemplo: 11111111-1",
                }}
            />
            <InputComponent
                name="name"
                label="Nombres"
                control={control}
                error={errors?.name}
                rules={{
                    required: "Los nombres son requeridos",
                }}
            />
            <InputComponent
                name="surname"
                label="Apellidos"
                control={control}
                error={errors?.surname}
                rules={{
                    required: "Los apellidos son requeridos",
                }}
            />
            <InputComponent
                name="email"
                label="Correo electrónico"
                control={control}
                error={errors?.email}
                rules={{
                    required: "El correo electrónico es requerido",
                    maxLength: {
                        value: 254,
                        message: "El máximo de caracteres es 254",
                    },
                    pattern: {
                        value: emailFormatRegex,
                        message:
                            "Formato de correo incorrecto. Ej:ejemplo@correo.cl",
                    },
                }}
            />
            <InputComponent
                name="password"
                label="Contraseña"
                type="password"
                control={control}
                error={errors?.password}
                rules={{
                    required: "La contraseña es requerida",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    minLength: {
                        value: 10,
                        message: "El mínimo de caracteres es 10",
                    },
                    pattern: {
                        value: passwordFormatRegex,
                        message:
                            "Formato de contraseña incorrecto, debe ser alfanumérico",
                    },
                }}
            />
            <InputComponent
                name="confirmPassword"
                label="Confirmar contraseña"
                type="password"
                control={control}
                error={errors?.confirmPassword}
                rules={{
                    required: "La confirmación de contraseña es requerida",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    validate: {
                        confirmPassword: (value) =>
                            watch("password").toString() === value ||
                            "Las contraseñas deben ser iguales",
                    },
                }}
            />
            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={!props.canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    Registrarse
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

export default RegisterVendorForm;
