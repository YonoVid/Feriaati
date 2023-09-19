import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Box, Button, Card, Divider } from "@mui/material";

import { controlValidInput } from "@feria-a-ti/common/inputControl";
import { RUserFullUpdateProps } from "@feria-a-ti/common/model/props/productVendorUpdateFormProps";
import { FormUpdateFullUserFields } from "@feria-a-ti/common/model/fields/adminFields";

import {
    emailFormatRegex,
    passwordFormatRegex,
} from "@feria-a-ti/common/check/checkBase";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./AdminUserUpdateForm.css";

function AdminUserUpdateForm(props: RUserFullUpdateProps) {
    const { label, color, children, user, onSubmit, onCancel } = props;

    const { setValue, handleSubmit, watch, control } =
        useForm<FormUpdateFullUserFields>();

    useEffect(() => {
        if (user) {
            setValue("email", user.email);
            setValue("password", user.password);
            setValue("confirmPassword", user.password);
            setValue("username", user.username);
        }
    }, [user, setValue]);

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
                        name="username"
                        label="Nombre de usuario"
                        type="text"
                        onChange={controlValidInput}
                        rules={{
                            required: "El nombre de usuario es requerido",
                            minLength: {
                                value: 8,
                                message: "El mínimo de caracteres es 8",
                            },
                            maxLength: {
                                value: 25,
                                message: "El máximo de caracteres es 128",
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

export default AdminUserUpdateForm;
