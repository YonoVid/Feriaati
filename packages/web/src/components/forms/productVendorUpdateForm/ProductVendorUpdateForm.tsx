import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Grid,
    LinearProgress,
} from "@mui/material";

import { compressImage } from "@feria-a-ti/common/compression";
import { RProductVendorUpdateProps } from "@feria-a-ti/common/model/props/productVendorUpdateFormProps";
import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import TimeInputComponent from "@feria-a-ti/web/src/components/timeInputComponent/TimeInputComponent";

import "./ProductVendorUpdateForm.css";
import { phoneFormatRegex } from "@feria-a-ti/common/check/checkAccountFields";
import { emailFormatRegex } from "@feria-a-ti/common/check/checkLoginFields";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

function ProductVendorUpdateForm(props: RProductVendorUpdateProps) {
    const {
        buttonLabel,
        label,
        color,
        children,
        imageData,
        editedVendor,
        onSubmit,
        onCancel,
        setImageData,
    } = props;

    const { setValue, handleSubmit, watch, control } =
        useForm<UpdateProductVendorFields>();

    useEffect(() => {
        if (editedVendor) {
            setValue("serviceTime", editedVendor.serviceTime);
            editedVendor.contact?.phone &&
                setValue("contactPhone", editedVendor.contact?.phone);
            editedVendor.contact?.email &&
                setValue("contactEmail", editedVendor.contact?.email);
        }
    }, [editedVendor, setValue]);

    const [localImageData, setLocalImageData] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);

    //Image reader
    const fileReader = new FileReader();

    if (fileReader != null) {
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            const newValue: string = ev.target?.result as string;
            setLocalImageData(newValue);
            setImageData(newValue);
        };
    }

    const fileStore = async (e: ChangeEvent<Element>) => {
        setIsLoading(true);
        const target = e.target as HTMLInputElement;
        if (
            !(
                e.target.hasAttribute("type") &&
                e.target.getAttribute("type") === "submit"
            ) &&
            target &&
            target != null &&
            target.files != null
        ) {
            const img = await compressImage(target!.files![0]);
            fileReader?.readAsDataURL(img as File);
        }
        setIsLoading(false);
    };

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "50%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <h1 style={{ maxWidth: "100%" }}>
                {label != null ? label : "Iniciar Sesion"}
            </h1>
            <form
                key={"productVendorUpdateForm"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box>
                    {isLoading && <LinearProgress />}
                    <Grid container>
                        <Grid item xs={10}>
                            <InputComponentAlt
                                control={control}
                                name="image"
                                label="Imágen"
                                type="file"
                                rules={{
                                    validate: () =>
                                        !isLoading ||
                                        "Hay imagenes que se están procesando",
                                }}
                                onChange={async (e) => {
                                    await fileStore(e);
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Avatar
                                alt="Image Preview 1"
                                src={localImageData || imageData}
                                sx={{ width: 56, height: 56 }}
                            >
                                1
                            </Avatar>
                        </Grid>
                    </Grid>
                </Box>
                <Box>
                    <Box>
                        <InputComponentAlt
                            name="enterpriseName"
                            label="Nombre de empresa"
                            disabled={true}
                            defaultValue={editedVendor?.enterpriseName}
                            type="text"
                            rules={{
                                required: "El nombre de empresa es requerido",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                            }}
                        />
                    </Box>
                </Box>

                <Box>
                    <TimeInputComponent
                        control={control}
                        name="serviceTime.start"
                        defaultValue={
                            (editedVendor?.serviceTime != null &&
                                editedVendor?.serviceTime.start) ||
                            ""
                        }
                        label="Inicio atención (opcional)"
                        sx={{ width: "10em" }}
                        type="time"
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
                        defaultValue={
                            (editedVendor?.serviceTime != null &&
                                editedVendor?.serviceTime.end) ||
                            ""
                        }
                        sx={{ width: "10em" }}
                        label="Término de atención (opcional)"
                        type="time"
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
                                            watch("serviceTime.start")
                                                .minutes) ||
                                    "El término debe ser después que el inicio",
                            },
                        }}
                    />
                </Box>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="contactPhone"
                        label="Teléfono de contacto (opcional)"
                        type="text"
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
                                message:
                                    "El formato debe ser como: +56911111111",
                            },
                        }}
                    />
                    <InputComponentAlt
                        control={control}
                        name="contactEmail"
                        label="Correo de contacto (opcional)"
                        type="text"
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
                </Box>
                <Box sx={{ margin: "1em" }}>
                    <Button
                        color={colorTheme}
                        type="submit"
                        variant="contained"
                        disabled={
                            props.canSubmit != null ? !props.canSubmit : false
                        }
                    >
                        {buttonLabel ? buttonLabel : "Agregar Producto"}
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={onCancel}
                        disabled={
                            props.canSubmit != null ? !props.canSubmit : false
                        }
                    >
                        Cancelar
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductVendorUpdateForm;
