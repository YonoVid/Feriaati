import { useForm } from "react-hook-form";
import { Box, Button, Card, CardActions } from "@mui/material";

import { compressImage } from "@feria-a-ti/common/compression";
import {
    checkRutVerificationCodeString,
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
    rutFormatRegex,
} from "@feria-a-ti/common/check/checkRegisterFields";
import { RegisterVendorFields } from "@feria-a-ti/common/model/registerFields";
import { RRegisterVendorFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./RegisterVendorForm.css";

function RegisterVendorForm(props: RRegisterVendorFormProps) {
    const { setImageData, onSubmit } = props;
    const { watch, handleSubmit, setValue, control } =
        useForm<RegisterVendorFields>();

    //Image reader
    const fileReader = new FileReader();

    if (fileReader != null && setImageData != null) {
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            setImageData(ev.target?.result as ArrayBuffer);
        };
    }

    return (
        <>
            <Card
                className="inputContainer"
                sx={{
                    maxWidth: "60%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1 style={{ maxWidth: "80%" }}>REGISTRARSE</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="enterpriseName"
                            label="Nombre de la empresa"
                            type="text"
                            rules={{
                                required:
                                    "El nombre de la empresa es requerido",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                            }}
                        />
                        <InputComponentAlt
                            control={control}
                            name="localNumber"
                            label="Número de local"
                            type="text"
                            rules={{
                                required: "El número de local es requerido",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: numberRegex,
                                    message: "Valor debe ser numérico",
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="region"
                            label="Región"
                            type="select"
                            selectOptions={regionCode}
                            defaultValue="Elige tú región"
                            onChange={() => setValue("commune", NaN)}
                            rules={{
                                required: "La región es requerida",
                            }}
                        />
                        <InputComponentAlt
                            control={control}
                            name="commune"
                            label="Comuna"
                            type="select"
                            selectOptions={regionCommune[watch("region")]}
                            defaultValue="Elige tú comuna"
                            rules={{
                                required: "La comuna es requerida",
                            }}
                        />
                    </Box>
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="street"
                            label="Calle"
                            type="text"
                            rules={{
                                required: "La calle es requerida",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                            }}
                        />
                        <InputComponentAlt
                            control={control}
                            name="streetNumber"
                            label="Número de calle"
                            type="text"
                            rules={{
                                required: "El número de calle es requerido",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: numberRegex,
                                    message: "Valor debe ser numérico",
                                },
                            }}
                        />
                    </Box>
                    <InputComponentAlt
                        control={control}
                        name="image"
                        label="Imagen de local"
                        type="file"
                        rules={{
                            required: "Se debe subir una imagen del local",
                        }}
                        onChange={async (e) => {
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
                                const img = await compressImage(
                                    target!.files![0]
                                );
                                fileReader?.readAsDataURL(img as File);
                            }
                        }}
                    />
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="rut"
                            label="RUT"
                            type="text"
                            rules={{
                                required: "El RUT es requerido",
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: rutFormatRegex,
                                    message:
                                        "El formato debe ser, por ejemplo: 11111111-1",
                                },
                                validate: (value) =>
                                    checkRutVerificationCodeString(
                                        value as string
                                    ) ||
                                    "El formato debe ser, por ejemplo: 11111111-1",
                            }}
                        />
                        <InputComponentAlt
                            control={control}
                            name="name"
                            label="Nombres"
                            type="text"
                            rules={{
                                required: "Los nombres son requeridos",
                            }}
                        />
                        <InputComponentAlt
                            control={control}
                            name="surname"
                            label="Apellidos"
                            type="text"
                            rules={{
                                required: "Los apellidos son requeridos",
                            }}
                        />
                    </Box>
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
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="password"
                            label="Contraseña"
                            type="password"
                            rules={{
                                required: "La contraseña es requerida",
                                minLength: {
                                    value: 8,
                                    message: "El mínimo de caracteres es 8",
                                },
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: passwordFormatRegex,
                                    message:
                                        "La contraseña debe ser alfanumérica\n(contener una letra y un número)",
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
                                        watch("password").toString() ===
                                            value ||
                                        "Las contraseñas deben ser iguales",
                                },
                            }}
                        />
                    </Box>
                    <CardActions>
                        <Button
                            sx={{
                                borderRadius: "20em",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            color="secondary"
                            type="submit"
                            variant="contained"
                            disabled={
                                props.canSubmit != null
                                    ? !props.canSubmit
                                    : false
                            }
                        >
                            Registrar cuenta de vendedor
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </>
    );
}

export default RegisterVendorForm;
