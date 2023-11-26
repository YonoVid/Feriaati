import { ChangeEvent, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
    Box,
    Button,
    Card,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

import { RRegisterContributorFormProps } from "@feria-a-ti/common/model/props/registerContributorFormProps";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";

import "./RegisterContributorForm.css";
import {
    emailFormatRegex,
    passwordFormatRegex,
    stringRegex,
} from "@feria-a-ti/common/check/checkBase";
import { RegisterContributorFields } from "@feria-a-ti/common/model/fields/registerFields";
import { controlValidStringInput } from "@feria-a-ti/common/inputControl";
import { ContributorLevel } from "@feria-a-ti/common/model/functionsTypes";

function RegisterContributorForm(props: RRegisterContributorFormProps) {
    const { contributor, isEdit, canSubmit, onCancel, onSubmit } = props;
    const { setValue, handleSubmit, watch, control, reset } =
        useForm<RegisterContributorFields>({
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
        <Card
            className="inputContainer"
            sx={{
                maxWidth: "50%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <h1 style={{ maxWidth: "100%" }}>
                {isEdit ? "Actualizar" : "Registrar"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="name"
                        label="Nombre/s"
                        type="text"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (controlValidStringInput(e) != null) {
                                generateIdentifier();
                            }
                        }}
                        rules={{
                            ...(isEdit
                                ? {}
                                : {
                                      required:
                                          "El nombre de usuario es requerido",
                                  }),
                            maxLength: {
                                value: 128,
                                message: "El máximo de caracteres es 128",
                            },
                            pattern: {
                                value: stringRegex,
                                message:
                                    "El nombre tiene un formato incorrecto",
                            },
                        }}
                    />
                </Box>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="surname"
                        label="Apellido/s"
                        type="text"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            if (controlValidStringInput(e) != null) {
                                generateIdentifier();
                            }
                        }}
                        rules={{
                            ...(isEdit
                                ? {}
                                : { required: "El apellido es requerido" }),
                            maxLength: {
                                value: 128,
                                message: "El máximo de caracteres es 128",
                            },
                            pattern: {
                                value: stringRegex,
                                message:
                                    "El apellido tiene un formato incorrecto",
                            },
                        }}
                    />
                </Box>
                <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">
                        Permisos
                    </FormLabel>
                    <Controller
                        control={control}
                        name="permission"
                        render={({ field: { onChange, value } }) => (
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="none"
                                name="radio-buttons-group"
                                value={value || "Manager"}
                                onChange={onChange}
                            >
                                <FormControlLabel
                                    value={ContributorLevel.MANAGER}
                                    control={<Radio />}
                                    label="Manager"
                                />
                                <FormControlLabel
                                    value={ContributorLevel.CASHIER}
                                    control={<Radio />}
                                    label="Vendedor"
                                />
                                <FormControlLabel
                                    value={ContributorLevel.VIEWER}
                                    control={<Radio />}
                                    label="Revisor"
                                />
                            </RadioGroup>
                        )}
                    />
                </FormControl>
                {isEdit && (
                    <>
                        <Box>
                            <InputComponentAlt
                                control={control}
                                name="email"
                                label="Identificación"
                                disabled
                                type="text"
                                rules={{
                                    ...(isEdit
                                        ? {}
                                        : {
                                              required:
                                                  "El identificador es requerido",
                                          }),
                                    maxLength: {
                                        value: 128,
                                        message:
                                            "El máximo de caracteres es 128",
                                    },
                                    pattern: {
                                        value: emailFormatRegex,
                                        message:
                                            "El identificador tiene un formato incorrecto",
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
                                    ...(isEdit
                                        ? {}
                                        : {
                                              required:
                                                  "La contraseña es requerida",
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
                            <InputComponentAlt
                                control={control}
                                name="confirmPassword"
                                label="Confirmar contraseña"
                                type="password"
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
                        </Box>
                    </>
                )}
                <Box
                    sx={{
                        margin: "1em",
                        display: "flex",
                        flexDirection: "row",
                        contentAlign: "center",
                        alignContent: "center",
                        justifyContent: "space-around",
                    }}
                >
                    <Button
                        color="primary"
                        type="submit"
                        variant="contained"
                        disabled={canSubmit != null ? !canSubmit : false}
                        onClick={() => {
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
                        }}
                    >
                        {isEdit ? "Editar" : "Registrar"}
                    </Button>
                    <Button
                        color="secondary"
                        type="button"
                        variant="contained"
                        onClick={() => {
                            onCancel();
                            reset();
                        }}
                        disabled={canSubmit != null ? !canSubmit : false}
                    >
                        Cancelar
                    </Button>
                </Box>
            </form>
            <Divider />
        </Card>
    );
}

export default RegisterContributorForm;
