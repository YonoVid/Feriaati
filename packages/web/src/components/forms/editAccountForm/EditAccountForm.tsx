import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardActions,
    Divider,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import {
    emailFormatRegex,
    numberRegex,
    passwordFormatRegex,
} from "@feria-a-ti/common/check/checkRegisterFields";
import { REditAccountFormProps } from "@feria-a-ti/common/model/account/editAccountFormProps";
import {
    AccountDirection,
    EditVendorAccountFields,
} from "@feria-a-ti/common/model/account/editAccountFields";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./EditAccountForm.css";
import { useEffect, useState } from "react";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { phoneFormatRegex } from "@feria-a-ti/common/check/checkAccountFields";

function EditAccountForm(props: REditAccountFormProps) {
    const { account, children, onSubmit } = props;
    const { watch, handleSubmit, setValue, control } =
        useForm<EditVendorAccountFields>();

    const [userDirections, setUserDirections] = useState<
        Array<AccountDirection>
    >([]);

    const addDirectionField = () => {
        const newValue = userDirections.concat({
            street: "",
            streetNumber: NaN,
            region: NaN,
            commune: NaN,
        });
        setUserDirections(newValue);
    };

    const removeDirectionField = (index: number) => {
        const newValue = userDirections.filter(
            (value, valueIndex, valueArray) => index !== valueIndex
        );
        setUserDirections(newValue);
    };

    useEffect(() => {
        if (account && account !== null) {
            setValue("email", account.email);
            account.phone && setValue("phone", account.phone);
            if (account.direction) {
                setValue("direction", account.direction);
                setUserDirections(account.direction);
            }
        }
    });

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
                <h1 style={{ maxWidth: "80%", textAlign: "center" }}>
                    Información de cuenta
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputComponentAlt
                        control={control}
                        name="email"
                        label="Correo electrónico"
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
                    <Box>
                        <InputComponentAlt
                            control={control}
                            defaultValue={"********"}
                            name="password"
                            label="Nueva contraseña"
                            type="password"
                            rules={{
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
                            defaultValue={"********"}
                            name="confirmPassword"
                            label="Confirmar nueva contraseña"
                            type="password"
                            rules={{
                                validate: {
                                    confirmPassword: (value) =>
                                        watch("password") == null ||
                                        watch("password")?.toString() ===
                                            value ||
                                        watch("password")?.toString() === "" ||
                                        "Las contraseñas deben ser iguales",
                                },
                            }}
                        />
                    </Box>
                    <Box>
                        <InputComponentAlt
                            control={control}
                            name="phone"
                            label="Teléfono (opcional)"
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
                    </Box>
                    <CardActions>
                        <Button
                            sx={{
                                borderRadius: "20em",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            color="primary"
                            variant="contained"
                            disabled={
                                props.canSubmit != null
                                    ? !props.canSubmit
                                    : false
                            }
                            onClick={() => addDirectionField()}
                            startIcon={<AddIcon />}
                        >
                            Añadir dirección
                        </Button>
                    </CardActions>
                    {userDirections?.map((value, index, array) => (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                boxShadow: 1,
                            }}
                            key={index}
                        >
                            <Box sx={{ flex: 5 }}>
                                <Box>
                                    <InputComponentAlt
                                        key={`direction.${index}.region`}
                                        control={control}
                                        name={`direction.${index}.region`}
                                        label="Región"
                                        type="select"
                                        selectOptions={regionCode}
                                        defaultValue="Elige tú región"
                                        onChange={() =>
                                            setValue(
                                                `direction.${index}.commune`,
                                                NaN
                                            )
                                        }
                                        rules={{
                                            required: "La región es requerida",
                                        }}
                                    />
                                    <InputComponentAlt
                                        key={`direction.${index}.commune`}
                                        control={control}
                                        name={`direction.${index}.commune`}
                                        label="Comuna"
                                        type="select"
                                        selectOptions={
                                            regionCommune[
                                                watch(
                                                    `direction.${index}.region`
                                                )
                                            ]
                                        }
                                        defaultValue="Elige tú comuna"
                                        rules={{
                                            required: "La comuna es requerida",
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <InputComponentAlt
                                        key={`direction.${index}.street`}
                                        control={control}
                                        name={`direction.${index}.street`}
                                        label="Calle"
                                        type="text"
                                        rules={{
                                            required: "La calle es requerida",
                                            maxLength: {
                                                value: 128,
                                                message:
                                                    "El máximo de caracteres es 128",
                                            },
                                        }}
                                    />
                                    <InputComponentAlt
                                        sx={{ maxWidth: "8em" }}
                                        key={`direction.${index}.streetNumber`}
                                        control={control}
                                        name={`direction.${index}.streetNumber`}
                                        label="Número de calle"
                                        type="text"
                                        rules={{
                                            required:
                                                "El número de calle es requerido",
                                            maxLength: {
                                                value: 128,
                                                message:
                                                    "El máximo de caracteres es 128",
                                            },
                                            pattern: {
                                                value: numberRegex,
                                                message:
                                                    "Valor debe ser numérico",
                                            },
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <IconButton
                                    sx={{
                                        borderRadius: "20em",
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                    }}
                                    color="error"
                                    disabled={
                                        props.canSubmit != null
                                            ? !props.canSubmit
                                            : false
                                    }
                                    onClick={() => removeDirectionField(index)}
                                >
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
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
                            Actualizar cuenta de vendedor
                        </Button>
                    </CardActions>
                </form>
                <Divider />
                <Box sx={{ margin: "1em" }}>{children}</Box>
            </Card>
        </>
    );
}

export default EditAccountForm;
