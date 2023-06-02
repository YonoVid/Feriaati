import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    LinearProgress,
    Radio,
    RadioGroup,
} from "@mui/material";

import {
    ProductFields,
    RProductAddFormProps,
} from "@feria-a-ti/common/model/productAddFormProps";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./ProductAddForm.css";
import { compressImage } from "@feria-a-ti/common/compression";
function ProductAddForm(props: RProductAddFormProps) {
    const {
        buttonLabel,
        label,
        color,
        children,
        imageData,
        editableState,
        setImageData,
        onSubmit,
    } = props;
    const { setValue, handleSubmit, watch, control } = useForm<ProductFields>({
        defaultValues: { discount: "none" },
    });

    useEffect(() => {
        if (editableState) {
            setValue("name", editableState.name);
            setValue("price", editableState.price);
            setValue("discount", editableState.discount);
            setValue("description", editableState.description);
            setValue("promotion", editableState.promotion);
            setLocalImageData(editableState.image);
            setImageData(editableState.image);
        }
    }, [editableState]);

    const [localImageData, setLocalImageData] = useState<
        [string, string, string]
    >(["", "", ""]);

    const [isLoading, setIsLoading] = useState(false);

    //Image reader
    const fileReader = new FileReader();

    let fileIndex = 0;

    if (fileReader != null && setImageData != null) {
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            const newValue: [string, string, string] = [...localImageData];
            newValue[fileIndex] = ev.target?.result as string;
            setLocalImageData(newValue);
            setImageData(newValue);
        };
    }

    const fileStore = async (e: ChangeEvent<Element>, index: number) => {
        setIsLoading(true);
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    {isLoading && <LinearProgress />}
                    <Grid container>
                        <Grid item xs={10}>
                            <InputComponentAlt
                                control={control}
                                name="image"
                                label="Imagenes"
                                type="file"
                                rules={
                                    editableState
                                        ? {
                                              validate: () =>
                                                  !isLoading ||
                                                  "Hay imagenes que se están procesando",
                                          }
                                        : {
                                              required:
                                                  "La imagen es requerida",
                                              validate: () =>
                                                  !isLoading ||
                                                  "Hay imagenes que se están procesando",
                                          }
                                }
                                onChange={async (e) => {
                                    await fileStore(e, 0);
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Avatar
                                alt="Image Preview 1"
                                src={localImageData[0]}
                                sx={{ width: 56, height: 56 }}
                            >
                                1
                            </Avatar>
                        </Grid>
                    </Grid>
                    {imageData[0] !== "" && (
                        <Grid container>
                            <Grid item xs={10}>
                                <InputComponentAlt
                                    name="image"
                                    label="Imagenes"
                                    type="file"
                                    onChange={async (e) => {
                                        await fileStore(e, 1);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Avatar
                                    alt="Image Preview 2"
                                    src={localImageData[1]}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    2
                                </Avatar>
                            </Grid>
                        </Grid>
                    )}
                    {imageData[1] !== "" && (
                        <Grid container>
                            <Grid item xs={10}>
                                <InputComponentAlt
                                    name="image"
                                    label="Imagenes"
                                    type="file"
                                    onChange={async (e) => {
                                        await fileStore(e, 2);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Avatar
                                    alt="Image Preview 2"
                                    src={localImageData[1]}
                                    sx={{ width: 56, height: 56 }}
                                >
                                    3
                                </Avatar>
                            </Grid>
                        </Grid>
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
                        {buttonLabel ? buttonLabel : "Agregar Producto"}
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductAddForm;
