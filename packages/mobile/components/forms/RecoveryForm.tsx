import "react-native-get-random-values";
import React from "react";
import { useForm } from "react-hook-form";
import InputComponent from "../inputs/InputComponent";
import { Text, View, Button, StyleSheet } from "react-native";
import { colors } from "@feria-a-ti/common/theme/base";
import { RecoveryFields } from "@feria-a-ti/common/model/loginFields";
import { RRecoveryFormProps } from "@feria-a-ti/common/model/loginFormProps";
import { emailFormatRegex } from "@feria-a-ti/common/check/checkRegisterFields";
import { Link } from "expo-router";

function RecoveryForm(props: RRecoveryFormProps) {
    const { canSubmit } = props;
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RecoveryFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recuperar contraseña</Text>

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

export default RecoveryForm;
