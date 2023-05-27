import { useForm } from "react-hook-form";
import "./LoginForm.css";
import { RLoginFormProps } from "@feria-a-ti/common/model/loginFormProps";
import { Box, Button, Card, Divider } from "@mui/material";
import InputComponentAlt from "../inputComponent/InputComponentAlt";
import { emailFormatRegex } from "@feria-a-ti/common/checkLoginFields";

function LoginForm(props: RLoginFormProps) {
    const { children, onSubmit } = props;
    const {
        formState: { errors },
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
            <h1 style={{ maxWidth: "100%" }}>Iniciar Sesion</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                        Iniciar sesión
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default LoginForm;