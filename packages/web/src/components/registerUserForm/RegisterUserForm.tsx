import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import "./RegisterUserForm.css";
import { RRegisterFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { Box, Button, Card, Divider } from "@mui/material";
import InputComponentAlt from "../inputComponent/InputComponentAlt";
import { emailFormatRegex } from "@feria-a-ti/common/checkRegisterFields";

function RegisterUserForm(props: RRegisterFormProps) {
    const { children, onSubmit } = props;
    const {
        formState: { errors },
        watch,
        handleSubmit,
        control,
    } = useForm();

    return (
        <Card
            className="inputContainer"
            sx={{
                maxWidth: "50%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <h1 style={{ maxWidth: "100%" }}>Registrarse</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                message: "El máximo de caracteres es 128",
                            },
                            maxLength: {
                                value: 25,
                                message: "El máximo de caracteres es 128",
                            },
                        }}
                        error={errors.name}
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
                        error={errors.password}
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
                        }}
                        error={errors.confirmPassword}
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
                                    watch("password").toString() === value ||
                                    "Las contraseñas deben ser iguales",
                            },
                        }}
                        error={errors.confirmPassword}
                    />
                </Box>
                <Box sx={{ margin: "1em" }}>
                    <Button
                        color="secondary"
                        type="submit"
                        variant="contained"
                        disabled={
                            props.canSubmit != null ? !props.canSubmit : false
                        }
                    >
                        Registrar cuenta de comprador
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default RegisterUserForm;