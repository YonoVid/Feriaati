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
import { RProductVendorUpdateProps } from "@feria-a-ti/common/model/productVendorUpdateFormProps";
import { ProductListCollectionData } from "@feria-a-ti/common/model/functionsTypes";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./ProductVendorUpdateForm.css";

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
    } = props;

    const { setValue, handleSubmit, watch, control } =
        useForm<ProductListCollectionData>();

    useEffect(() => {
        if (editedVendor) {
            setValue("enterpriseName", editedVendor?.enterpriseName);
            setValue("serviceTime", editedVendor.serviceTime);
            setValue("serviceZone", editedVendor.serviceZone);
            setValue("contact", editedVendor.contact);
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
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            control={control}
                            name="enterpriseName"
                            label="Nombre de empresa"
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
                    <InputComponentAlt
                        control={control}
                        name="serviceTime"
                        label="Rango de horas de trabajo"
                        type="number"
                        rules={{
                            required: "El precio es requerido",
                        }}
                    />
                </Box>
                <Box sx={{ margin: "1em" }}>
                    <Button
                        color={colorTheme}
                        type="submit"
                        variant="contained"
                        onClick={onSubmit}
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
