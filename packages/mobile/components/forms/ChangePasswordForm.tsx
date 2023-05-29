import "react-native-get-random-values";
import React from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../inputs/InputComponent";
import { Text, View, Button, StyleSheet } from "react-native";
import { colors } from "@feria-a-ti/common/theme/base";
import {
    LoginFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import { RRecoveryFormProps } from "@feria-a-ti/common/model/loginFormProps";
import {
    emailFormatRegex,
    passwordFormatRegex,
} from "@feria-a-ti/common/check/checkRegisterFields";
import { Link } from "expo-router";

export const ChangePasswordForm = (props: RRecoveryFormProps) => {
    const { canSubmit } = props;
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UpdatePassFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar contraseña</Text>
            <InputComponent
                name="codigo"
                label="Código"
                control={control}
                error={errors?.codigo}
                rules={{
                    required: "El código es requerido",
                    minLength: {
                        value: 6,
                        message: "El código debe tener 6 caracters",
                    },
                    maxLength: {
                        value: 6,
                        message: "El código debe tener 6 caracters",
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
                }}
            />

            <View style={styles.button}>
                <Button
                    color={styles.buttonInner.color}
                    title="Iniciar Sesion"
                    disabled={!canSubmit}
                    onPress={handleSubmit(props.onSubmit)}
                />
            </View>
        </View>
    );
};
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
