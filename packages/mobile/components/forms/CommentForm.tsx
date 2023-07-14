import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import { Controller, FieldError, useForm } from "react-hook-form";
import { Button, IconButton } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";

import { RFormProps } from "@feria-a-ti/common/model/props/registerFormProps";
import { CommentFields } from "@feria-a-ti/common/model/comments/commentsFields";
import { stringRegex } from "@feria-a-ti/common/check/checkBase";

import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import DropdownComponent from "@feria-a-ti/mobile/components/inputs/DropdownComponent";
import FileInputComponent from "../inputs/FileInputComponent";

function CommentForm(props: RFormProps) {
    const { children, canSubmit, onSubmit } = props;
    const { handleSubmit, reset, control } = useForm<CommentFields>();

    return (
        <View style={{ flexDirection: "column" }}>
            <InputComponent
                name="comment"
                label="Danos tu opinión"
                multiline={true}
                rows={3}
                control={control}
                style={{ flex: 5 }}
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
                }}
            />

            <View style={styles.button}>
                <Button
                    mode="contained"
                    color={styles.buttonInner.color}
                    disabled={!props.canSubmit}
                    onPress={() => {
                        reset();
                        handleSubmit(onSubmit);
                    }}
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
