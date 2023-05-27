import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { colors } from "@feria-a-ti/common/theme/base";
import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import { emailFormatRegex } from "@feria-a-ti/common/checkRegisterFields";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { LoginFormProps } from "@feria-a-ti/common/model/loginFormProps";

function LoginForm(props: LoginFormProps) {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

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
                }}
            />

            <View style={styles.button}>
                <Button
                    color={styles.buttonInner.color}
                    title="Iniciar Sesion"
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

export default LoginForm;
