import { ChangeEvent, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";

import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";

import {
    ProductFields,
    RProductAddFormProps,
} from "@feria-a-ti/common/model/productAddFormProps";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./ProductAddForm.css";
import { compressImage } from "@feria-a-ti/common/compression";
function ProductAddForm(props: RProductAddFormProps) {
    const { label, color, children, imageData, setImageData, onSubmit } = props;
    const { handleSubmit, watch, control } = useForm<ProductFields>();

    //Image reader
    const fileReader = new FileReader();

    let fileIndex = 0;
    // eslint-disable-next-line prefer-const
    let localImageData: [string, string, string] = ["", "", ""];

    if (fileReader != null && setImageData != null) {
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            localImageData[fileIndex] = ev.target?.result as string;
            setImageData(localImageData);
        };
    }

    const fileStore = async (e: ChangeEvent<Element>, index: number) => {
        const target = e.target as HTMLInputElement;
        fileIndex = index;
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="image"
                        label="Imagenes"
                        type="file"
                        rules={{
                            required: "La imagen es requerida",
                        }}
                        onChange={async (e) => {
                            await fileStore(e, 0);
                        }}
                    />
                    {imageData[0] !== "" && (
                        <InputComponentAlt
                            name="image"
                            label="Imagenes"
                            type="file"
                            onChange={async (e) => {
                                await fileStore(e, 1);
                            }}
                        />
                    )}
                    {imageData[1] !== "" && (
                        <InputComponentAlt
                            name="image"
                            label="Imagenes"
                            type="file"
                            onChange={async (e) => {
                                await fileStore(e, 2);
                            }}
                        />
                    )}
                </Box>
                <Box>
                    <Box>
                        <Box>
                            <InputComponentAlt
                                control={control}
                                name="name"
                                label="Producto"
                                type="text"
                                rules={{
                                    required:
                                        "El nombre del producto es requerido",
                                    maxLength: {
                                        value: 128,
                                        message:
                                            "El máximo de caracteres es 128",
                                    },
                                }}
                            />
                        </Box>
                        <Box>
                            <InputComponentAlt
                                control={control}
                                name="description"
                                label="Descripción"
                                rules={{
                                    required: "La descripción es requerida",
                                }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <InputComponentAlt
                        control={control}
                        name="price"
                        label="Precio"
                        type="number"
                        rules={{
                            required: "El precio es requerido",
                        }}
                    />
                </Box>
                <Box>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                            Descuento
                        </FormLabel>
                        <Controller
                            control={control}
                            name="discount"
                            render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="none"
                                    name="radio-buttons-group"
                                    value={value || "none"}
                                    onChange={onChange}
                                >
                                    <FormControlLabel
                                        value="none"
                                        control={<Radio />}
                                        label="Sin descuento"
                                    />
                                    <FormControlLabel
                                        value="percentage"
                                        control={<Radio />}
                                        label="Porcentual"
                                    />
                                    <FormControlLabel
                                        value="value"
                                        control={<Radio />}
                                        label="Cantidad"
                                    />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                    {watch("discount") !== "none" && (
                        <InputComponentAlt
                            control={control}
                            name="promotion"
                            label="Descuento"
                            type="number"
                            rules={{
                                validate: (value) =>
                                    (watch("discount") !== "none" &&
                                        value != "" &&
                                        value != null) ||
                                    "El descuento debe tener un valor numérico",
                            }}
                        />
                    )}
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
                        Iniciar sesión
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductAddForm;
