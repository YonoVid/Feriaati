import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import {
    Button,
    IconButton,
    ProgressBar,
    RadioButton,
} from "react-native-paper";

import { Controller } from "react-hook-form";

import { colors } from "@feria-a-ti/common/theme/base";
import { RegisterContributorFormProps } from "@feria-a-ti/common/model/props/registerContributorFormProps";

import { controlValidStringInput } from "@feria-a-ti/common/inputControl";

import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import FileInputComponent from "../inputs/FileInputComponent";
import {
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
    stringRegex,
} from "@feria-a-ti/common/check/checkBase";
import {
    ContributorLevel,
    ProductUnit,
} from "@feria-a-ti/common/model/functionsTypes";
import { RegisterContributorFields } from "@feria-a-ti/common/model/fields/registerFields";

function ContributorAdd(props: RegisterContributorFormProps) {
    const { contributor, isEdit, canSubmit, onCancel, onSubmit } = props;
    const {
        setValue,
        handleSubmit,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<RegisterContributorFields>({
        defaultValues: { permission: ContributorLevel.MANAGER },
    });

    //const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (contributor != null && contributor != undefined) {
            setValue("name", contributor.name);
            setValue("surname", contributor.surname);
            setValue("email", contributor.email);
            setValue("permission", contributor.permissions);
            setValue("password", contributor.password);
            setValue("confirmPassword", contributor.password);
        }
    }, [contributor, setValue]);

    const generateIdentifier = () => {
        if (
            watch("name") != null &&
            watch("name") != undefined &&
            watch("surname") != null &&
            watch("surname") != undefined
        ) {
            const name = watch("name").trim().toLowerCase().split(" ");
            const surname = watch("surname").trim().toLowerCase().split(" ");
            let identifier = "";
            for (let i = 0; i < name.length; i++) {
                if (i != 0) {
                    identifier += name[i].charAt(0);
                } else {
                    identifier +=
                        name[i]
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "") + "_";
                }
            }

            for (let e = 0; e < surname.length; e++) {
                identifier += surname[e].charAt(0);
            }

            setValue("email", identifier + "@feriaati.cl");
            if (!isEdit) {
                setValue("password", (identifier + "0").padEnd(10, "0"));
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {isEdit ? "Actualizar" : "Registrar"}
            </Text>

            <InputComponent
                name="name"
                label="Nombre/s"
                control={control}
                error={errors?.name}
                onChange={(value) => {
                    if (stringRegex.test(value)) {
                        generateIdentifier();
                    }
                }}
                rules={{
                    ...(isEdit
                        ? {}
                        : {
                              required: "El nombre de usuario es requerido",
                          }),
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: stringRegex,
                        message: "El nombre tiene un formato incorrecto",
                    },
                }}
            />

            <InputComponent
                control={control}
                name="surname"
                label="Apellido/s"
                error={errors?.surname}
                onChange={(value) => {
                    if (stringRegex.test(value)) {
                        generateIdentifier();
                    }
                }}
                rules={{
                    ...(isEdit ? {} : { required: "El apellido es requerido" }),
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: stringRegex,
                        message: "El apellido tiene un formato incorrecto",
                    },
                }}
            />

            <Controller
                control={control}
                name="permission"
                render={({ field: { onChange, value } }) => (
                    <RadioButton.Group
                        onValueChange={(value) => {
                            onChange(value);
                        }}
                        value={value || ContributorLevel.MANAGER}
                    >
                        <RadioButton.Item
                            label="Manager"
                            value={ContributorLevel.MANAGER}
                        />
                        <RadioButton.Item
                            label="Vendedor"
                            value={ContributorLevel.CASHIER}
                        />
                        <RadioButton.Item
                            label="Revisor"
                            value={ContributorLevel.VIEWER}
                        />
                    </RadioButton.Group>
                )}
            />

            {isEdit && (
                <>
                    <InputComponent
                        control={control}
                        name="email"
                        label="Identificador"
                        error={errors?.email}
                        disabled
                        rules={{
                            ...(isEdit
                                ? {}
                                : {
                                      required: "El identificador es requerido",
                                  }),
                            maxLength: {
                                value: 128,
                                message: "El máximo de caracteres es 128",
                            },
                            pattern: {
                                value: emailFormatRegex,
                                message:
                                    "El identificador tiene un formato incorrecto",
                            },
                        }}
                    />
                    <InputComponent
                        control={control}
                        name="password"
                        label="Contraseña"
                        type="password"
                        error={errors?.password}
                        rules={{
                            ...(isEdit
                                ? {}
                                : {
                                      required: "La contraseña es requerida",
                                      pattern: {
                                          value: passwordFormatRegex,
                                          message:
                                              "La contraseña debe ser alfanumérica",
                                      },
                                  }),
                            minLength: {
                                value: 10,
                                message:
                                    "La contraseña tiene un mínimo de 10 caracteres",
                            },
                        }}
                    />

                    <InputComponent
                        control={control}
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        type="password"
                        error={errors?.confirmPassword}
                        rules={{
                            ...(isEdit
                                ? {}
                                : {
                                      required:
                                          "Se debe confirmar la contraseña",
                                  }),
                            validate: {
                                confirmPassword: (value) =>
                                    (watch("password") != undefined &&
                                        watch("password") != null &&
                                        watch("password") != "" &&
                                        watch("password").toString() ===
                                            value) ||
                                    "Las contraseñas deben ser iguales",
                            },
                        }}
                    />
                </>
            )}

            <View style={styles.button}>
                <Button
                    style={{ flex: 4 }}
                    mode="contained-tonal"
                    color={styles.buttonInner.color}
                    disabled={!canSubmit}
                    onPressIn={() => {
                        if (
                            watch("name") !== "" &&
                            watch("name") !== undefined
                        ) {
                            setValue("name", watch("name").trim());
                        }
                        if (
                            watch("surname") !== "" &&
                            watch("surname") !== undefined
                        ) {
                            setValue("surname", watch("surname").trim());
                        }
                        generateIdentifier();
                    }}
                    onPress={handleSubmit(onSubmit)}
                >
                    {isEdit ? "Editar" : "Registrar"}
                </Button>
                {onCancel && (
                    <IconButton
                        style={{ flex: 1 }}
                        containerColor={colors.light}
                        icon="cancel"
                        size={20}
                        onPress={() => {
                            reset();
                            onCancel();
                        }}
                    />
                )}
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
        flexDirection: "row",
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

export default ContributorAdd;
