import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useForm } from "react-hook-form";
import { Button, IconButton, ProgressBar, TextInput } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";
import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";
import { RProductVendorUpdateProps } from "@feria-a-ti/common/model/props/productVendorUpdateFormProps";
import { emailFormatRegex } from "@feria-a-ti/common/check/checkBase";

import InputComponent from "@feria-a-ti/mobile/components/inputs/InputComponent";
import FileInputComponent from "../inputs/FileInputComponent";
import { phoneFormatRegex } from "@feria-a-ti/common/check/checkAccountFields";
import TimeInputComponent from "../inputs/TimeInputComponent";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

function ProductVendorUpdateForm(props: RProductVendorUpdateProps) {
    const {
        buttonLabel,
        canSubmit,
        editedVendor,
        onSubmit,
        onCancel,
        setImageData,
    } = props;

    const {
        setValue,
        handleSubmit,
        watch,
        formState: { errors },
        control,
    } = useForm<UpdateProductVendorFields>();

    const [localImageData, setLocalImageData] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);

    const fileStore = (data: any, index: number) => {
        const newValue: string = data;

        setValue("image", "image");

        setLocalImageData(newValue);
        setImageData(newValue);
    };

    useEffect(() => {
        if (editedVendor) {
            setValue("serviceTime", editedVendor.serviceTime);
            setValue("serviceTime.start", editedVendor.serviceTime.start);
            setValue("serviceTime.end", editedVendor.serviceTime.end);
            editedVendor.contact?.phone &&
                setValue("contactPhone", editedVendor.contact?.phone);
            editedVendor.contact?.email &&
                setValue("contactEmail", editedVendor.contact?.email);
            setLocalImageData(editedVendor.image);
            setImageData(editedVendor.image);
        }
    }, [editedVendor, setImageData, setValue]);

    console.log("VENDOR SERVICE TIME::" + editedVendor.serviceTime);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Actualizar local</Text>
            {isLoading && <ProgressBar indeterminate={true} />}
            <FileInputComponent
                name="image"
                type="image"
                control={control}
                label="Ingresar foto de local"
                defaultPreview={localImageData}
                error={errors?.image}
                rules={{
                    validate: () =>
                        !isLoading || "Hay imagenes que se están procesando",
                }}
                icon="camera"
                setData={(data: string | ArrayBuffer) => fileStore(data, 0)}
                setIsLoading={setIsLoading}
            />

            <TextInput
                label={"Nombre de la empresa"}
                value={editedVendor?.enterpriseName || ""}
                disabled
            />

            <TimeInputComponent
                control={control}
                name="serviceTime.start"
                label="Inicio atención (opcional)"
                rules={{
                    validate: {
                        rangeSet: (value) =>
                            value == null ||
                            (watch("serviceTime.end") != null &&
                                value != null) ||
                            "Se debe indicar el término",
                        lessThanMax: (value) =>
                            value == null ||
                            (value as DayTime).hours <
                                watch("serviceTime.end").hours ||
                            ((value as DayTime).hours ==
                                watch("serviceTime.end").hours &&
                                (value as DayTime).minutes <
                                    watch("serviceTime.end").minutes) ||
                            "El inicio debe ser antes que el término",
                    },
                }}
            />

            <TimeInputComponent
                control={control}
                name="serviceTime.end"
                label="Término atención (opcional)"
                rules={{
                    validate: {
                        rangeSet: (value) =>
                            value == null ||
                            (watch("serviceTime.start") != null &&
                                value != null) ||
                            "Se debe indicar el inicio",
                        moreThanMin: (value) =>
                            value == null ||
                            (value as DayTime).hours >
                                watch("serviceTime.start").hours ||
                            ((value as DayTime).hours ==
                                watch("serviceTime.start").hours &&
                                (value as DayTime).minutes >
                                    watch("serviceTime.start").minutes) ||
                            "El término debe ser después que el inicio",
                    },
                }}
            />

            <InputComponent
                control={control}
                name="contactPhone"
                label="Teléfono (opcional)"
                error={errors?.contactPhone}
                rules={{
                    minLength: {
                        value: 7,
                        message: "El mínimo de caracteres es 7",
                    },
                    maxLength: {
                        value: 15,
                        message: "El máximo de caracteres es 15",
                    },
                    pattern: {
                        value: phoneFormatRegex,
                        message: "El formato debe ser como: +56911111111",
                    },
                }}
            />

            <InputComponent
                control={control}
                name="contactEmail"
                label="Correo de contacto (opcional)"
                type="number"
                error={errors?.contactEmail}
                rules={{
                    maxLength: {
                        value: 128,
                        message: "El máximo de caracteres es 128",
                    },
                    pattern: {
                        value: emailFormatRegex,
                        message:
                            "El formato debe ser, por ejemplo: ejemplo@correo.cl",
                    },
                }}
            />

            <View style={styles.button}>
                <Button
                    style={{ flex: 4 }}
                    mode="contained-tonal"
                    color={styles.buttonInner.color}
                    disabled={!canSubmit}
                    onPress={handleSubmit(onSubmit)}
                >
                    {buttonLabel || "Agregar producto"}
                </Button>
                {onCancel && (
                    <IconButton
                        style={{ flex: 1 }}
                        containerColor={colors.light}
                        icon="cancel"
                        size={20}
                        onPress={onCancel}
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

export default ProductVendorUpdateForm;
