import React, { useCallback, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { FieldError, useForm } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import * as ExpoFileSystem from "expo-file-system";

import { colors } from "../../common/theme/base";
import InputComponent from "./InputComponent";
import {
    checkRutVerificationCodeString,
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
    rutFormatRegex,
} from "../../common/checkRegisterFields";
import { RegisterVendorFields } from "../../common/model/registerFields";
import { RRegisterVendorFormProps } from "../../common/model/registerFormProps";
import DropdownComponent from "./DropdownComponent";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

function RegisterVendorForm(props: RRegisterVendorFormProps) {
    const {
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<RegisterVendorFields>();

    const [fileResponse, setFileResponse] =
        useState<DocumentPicker.DocumentResult>();

    const handleDocumentSelection = useCallback(async () => {
        try {
            const response = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                multiple: false,
                copyToCacheDirectory: false,
            });
            setFileResponse(response);
            console.log(response);
            console.log(
                await ExpoFileSystem.readAsStringAsync(response["uri"], {
                    encoding: "base64",
                })
            );
        } catch (err) {
            console.warn(err);
        }
    }, []);

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
            <Button title="TEST PICKER" onPress={handleDocumentSelection} />
            <InputComponent
                name="image"
                label="Imagen de local"
                control={control}
                error={errors?.image as FieldError}
                rules={{
                    required: "La imagen del local es requerida",
                }}
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
                    color={styles.buttonInner.color}
                    title="Registrarse"
                    disabled={!props.canSubmit}
                    onPress={handleSubmit(props.onSubmit)}
                />
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
