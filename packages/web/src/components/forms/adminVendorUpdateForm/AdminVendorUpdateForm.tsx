import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Box, Button, Card, Divider } from "@mui/material";

import { RVendorFullUpdateProps } from "@feria-a-ti/common/model/props/productVendorUpdateFormProps";
import { FormUpdateFullVendorFields } from "@feria-a-ti/common/model/fields/adminFields";

import {
    emailFormatRegex,
    passwordFormatRegex,
    stringRegex,
} from "@feria-a-ti/common/check/checkBase";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./AdminVendorUpdateForm.css";

function AdminVendorUpdateForm(props: RVendorFullUpdateProps) {
    const { label, color, children, vendor, onSubmit, onCancel } = props;

    const { setValue, handleSubmit, watch, control } =
        useForm<FormUpdateFullVendorFields>();

    useEffect(() => {
        if (vendor) {
            setValue("email", vendor.email);
            setValue("password", vendor.password);
            setValue("confirmPassword", vendor.password);
            setValue("name", vendor.name);
            setValue("surname", vendor.surname);
        }
    }, [vendor, setValue]);

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
            <h1 style={{ maxWidth: "100%" }}>{"Modificar local"}</h1>
            <form
                key={"productVendorUpdateForm"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="name"
                        label="Nombres"
                        type="text"
                        rules={{
                            required: "Los nombres son requeridos",
                            pattern: {
                                value: stringRegex,
                                message:
                                    "No se aceptan caracteres especiales (Ej: <,>,+,-,etc.)",
                            },
                        }}
                    />
                    <InputComponentAlt
                        control={control}
                        name="surname"
                        label="Apellidos"
                        type="text"
                        rules={{
                            required: "Los apellidos son requeridos",
                            pattern: {
                                value: stringRegex,
                                message:
                                    "No se aceptan caracteres especiales (Ej: <,>,+,-,etc.)",
                            },
                        }}
                    />
                </Box>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="email"
                        label="Correo electrónico"
                        type="text"
                        rules={{
                            required: "El correo es requerido",
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
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="password"
                        label="Contraseña"
                        type="password"
                        rules={{
                            required: "La contraseña es requerida",
                            minLength: {
                                value: 10,
                                message:
                                    "La contraseña tiene un mínimo de 10 caracteres",
                            },
                            pattern: {
                                value: passwordFormatRegex,
                                message: "La contraseña debe ser alfanumérica",
                            },
                        }}
                    />
                    <InputComponentAlt
                        control={control}
                        name="confirmPassword"
                        label="Confirmar contraseña"
                        type="password"
                        rules={{
                            required: "Se debe confirmar la contraseña",
                            validate: {
                                confirmPassword: (value) =>
                                    watch("password") == undefined ||
                                    watch("password")?.toString() === value ||
                                    "Las contraseñas deben ser iguales",
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
                        {"Modificar usuario"}
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

export default AdminVendorUpdateForm;
