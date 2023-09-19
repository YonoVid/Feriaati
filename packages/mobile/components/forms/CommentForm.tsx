import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Button } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";

import { RFormProps } from "@feria-a-ti/common/model/props/registerFormProps";
import {
    CommentFields,
    OpinionValue,
} from "@feria-a-ti/common/model/comments/commentsFields";
import { stringRegex } from "@feria-a-ti/common/check/checkBase";

import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";

function CommentForm(props: RFormProps) {
    const { children, canSubmit, comment, onSubmit } = props;
    const {
        handleSubmit,
        reset,
        setValue,
        clearErrors,
        control,
        formState: { errors },
    } = useForm<CommentFields>();

    const [opinion, setOpinion] = useState<OpinionValue>(OpinionValue.NONE);

    const selectedIcon = {
        color: colors.secondary,
        border: 1,
        borderColor: colors.primary,
    };

    const changeOpinion = (value: OpinionValue) => {
        let newValue = value;
        if (opinion == value) {
            newValue = OpinionValue.NONE;
        }
        setOpinion(newValue);
        setValue("opinion", newValue);
        clearErrors();
    };

    useEffect(() => {
        if (comment && comment != null) {
            setValue("comment", comment.comment);
            changeOpinion(comment.opinion);
        }
        console.log(comment);
    }, [comment]);

    return (
        <View style={{ flexDirection: "column" }}>
            <View style={{ ...styles.button, flexDirection: "row" }}>
                <Button
                    style={{
                        flex: 1,
                        ...(opinion == OpinionValue.POSITIVE
                            ? {
                                  backgroundColor: colors.primary,
                                  ...selectedIcon,
                              }
                            : selectedIcon),
                    }}
                    mode={
                        opinion == OpinionValue.POSITIVE
                            ? "contained"
                            : "outlined"
                    }
                    disabled={!props.canSubmit}
                    onPress={() => changeOpinion(OpinionValue.POSITIVE)}
                    icon="thumb-up"
                >
                    Positivo
                </Button>
                <Button
                    style={{
                        flex: 1,
                        ...(opinion == OpinionValue.NEGATIVE
                            ? {
                                  ...selectedIcon,
                              }
                            : selectedIcon),
                    }}
                    mode={
                        opinion == OpinionValue.NEGATIVE
                            ? "contained"
                            : "outlined"
                    }
                    disabled={!props.canSubmit}
                    onPress={() => changeOpinion(OpinionValue.NEGATIVE)}
                    icon="thumb-down"
                >
                    Negativo
                </Button>
            </View>
            <InputComponent
                name="comment"
                label="Danos tu opinión"
                multiline={true}
                rows={3}
                style={{ flex: 5, margin: 2 }}
                control={control}
                error={errors?.comment}
                rules={{
                    required: "El comentario no puede estar vacío",
                    maxLength: {
                        value: 254,
                        message: "El máximo de caracteres es 254",
                    },
                    pattern: {
                        value: stringRegex,
                        message:
                            "No se aceptan caracteres especiales (Ej: <,>,+,-,etc.)",
                    },
                    validate: () =>
                        opinion != OpinionValue.NONE ||
                        "Se debe señalar si la opinión es positiva o negativa",
                }}
            />

            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={!props.canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    Enviar
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

export default CommentForm;
