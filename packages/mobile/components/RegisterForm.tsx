import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { colors } from "../../common/theme/base";
import InputComponent from "./InputComponent";
import {
    emailFormatRegex,
    passwordFormatRegex,
} from "../../common/checkRegisterFields";
import { RegisterFields } from "../../common/model/registerFields";
import { RegisterFormProps } from "../../common/model/registerFormProps";

function RegisterForm(props: RegisterFormProps) {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>REGISTER</Text>
            <InputComponent
                name="username"
                label="Nombre de usuario"
                control={control}
                error={errors?.username}
                rules={{
                    required: "El nombre de usuario es requerido",
                    maxLength: {
                        value: 25,
                        message: "El máximo de caracteres es 25",
                    },
                    minLength: {
                        value: 8,
                        message: "El mínimo de caracteres es 8",
                    },
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
            {props.children}
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

export default RegisterForm;
