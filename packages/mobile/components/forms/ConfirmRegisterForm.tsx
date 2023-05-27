import React from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { colors } from "@feria-a-ti/common/theme/base";
import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import { emailFormatRegex } from "@feria-a-ti/common/checkRegisterFields";
import { ConfirmRegisterFields } from "@feria-a-ti/common/model/registerFields";
import { ConfirmRegisterFormProps } from "@feria-a-ti/common/model/registerFormProps";

function ConfirmRegisterForm(props: ConfirmRegisterFormProps) {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ConfirmRegisterFields>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Confirmar registro</Text>
            <InputComponent
                name="code"
                label="Código de confirmación"
                control={control}
                error={errors?.code}
                rules={{
                    required: "El código de confirmación es requerido",
                    maxLength: {
                        value: 6,
                        message: "El máximo de caracteres es 6",
                    },
                    minLength: {
                        value: 6,
                        message: "El mínimo de caracteres es 6",
                    },
                }}
            />
            <View style={styles.button}>
                <Button
                    color={styles.buttonInner.color}
                    title="Confirmar registro"
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

export default ConfirmRegisterForm;
