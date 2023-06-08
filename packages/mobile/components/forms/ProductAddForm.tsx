import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Button, RadioButton } from "react-native-paper";

import { Controller } from "react-hook-form";

import { colors } from "@feria-a-ti/common/theme/base";
import {
    ProductFields,
    RProductAddFormProps,
} from "@feria-a-ti/common/model/productAddFormProps";
import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import FileInputComponent from "../inputs/FileInputComponent";

function ProductAddForm(props: RProductAddFormProps) {
    const { buttonLabel, canSubmit, setImageData, onSubmit } = props;
    const {
        setValue,
        handleSubmit,
        watch,
        control,
        formState: { errors },
    } = useForm<ProductFields>({ defaultValues: { discount: "none" } });

    const [localImageData, setLocalImageData] = useState<
        [string, string, string]
    >(["", "", ""]);

    const [isLoading, setIsLoading] = useState(false);

    const fileStore = (data: any, index: number) => {
        const newValue: [string, string, string] = [...localImageData];
        newValue[index] = data as string;

        setValue(
            index === 0 ? "image.0" : index === 1 ? "image.1" : "image.2",
            "image"
        );

        setLocalImageData(newValue);
        setImageData(newValue);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuevo producto</Text>
            <FileInputComponent
                name="image.0"
                type="image"
                control={control}
                label="Ingresar foto de local"
                error={errors?.image}
                rules={{
                    required: "La imagen del local es requerida",
                }}
                icon="camera"
                setData={(data: string | ArrayBuffer) => fileStore(data, 0)}
                setIsLoading={setIsLoading}
            />
            {localImageData[0] !== null && localImageData[0] !== "" && (
                <FileInputComponent
                    name="image.1"
                    type="image"
                    control={control}
                    label="Ingresar foto de local"
                    error={null}
                    icon="camera"
                    setData={(data: string | ArrayBuffer) => fileStore(data, 1)}
                    setIsLoading={setIsLoading}
                />
            )}
            {localImageData[1] !== null && localImageData[1] !== "" && (
                <FileInputComponent
                    name="image.2"
                    type="image"
                    control={control}
                    label="Ingresar foto de local"
                    error={null}
                    icon="camera"
                    setData={(data: string | ArrayBuffer) => fileStore(data, 2)}
                    setIsLoading={setIsLoading}
                />
            )}

            <InputComponent
                name="name"
                label="Producto"
                control={control}
                error={errors?.name}
                rules={{
                    required: "El nombre del producto es requerido",
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                }}
            />

            <InputComponent
                control={control}
                name="description"
                label="Descripción"
                error={errors?.description}
                rules={{
                    required: "La descripción es requerida",
                }}
            />

            <InputComponent
                control={control}
                name="price"
                label="Precio"
                type="number"
                error={errors?.price}
                rules={{
                    required: "El precio es requerido",
                }}
            />

            <Controller
                control={control}
                name="discount"
                render={({ field: { onChange, value } }) => (
                    <RadioButton.Group
                        onValueChange={(value) => onChange(value)}
                        value={value}
                    >
                        <RadioButton.Item label="Sin descuento" value="none" />
                        <RadioButton.Item
                            label="Porcentage"
                            value="percentage"
                        />
                        <RadioButton.Item label="Cantidad" value="value" />
                    </RadioButton.Group>
                )}
            />

            {watch("discount") !== "none" && (
                <InputComponent
                    control={control}
                    name="promotion"
                    label="Descuento"
                    type="number"
                    error={errors?.price}
                    rules={{
                        validate: {
                            isNumeric: (value) =>
                                (watch("discount") !== "none" &&
                                    value != "" &&
                                    value != null) ||
                                "El descuento debe tener un valor numérico",

                            lessThanTotal: (value) =>
                                (watch("discount") !== "none" &&
                                    (watch("discount") === "percentage"
                                        ? (watch("promotion") as number) < 100
                                        : (value as number) <=
                                          watch("price"))) ||
                                "El descuento no puede ser mayor al precio",
                        },
                    }}
                />
            )}
            <View style={styles.button}>
                <Button
                    mode="contained-tonal"
                    color={styles.buttonInner.color}
                    disabled={!canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    {buttonLabel || "Agregar producto"}
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

export default ProductAddForm;
