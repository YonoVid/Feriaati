import { useForm } from "react-hook-form";
import { Box, Button, Card, Divider } from "@mui/material";
import { RLoginFormProps } from "@feria-a-ti/common/model/props/loginFormProps";
import { LoginFields } from "@feria-a-ti/common/model/fields/loginFields";
import { emailFormatRegex } from "@feria-a-ti/common/check/checkLoginFields";

import InputComponentAlt from "../../inputComponent/InputComponentAlt";
import "./LoginForm.css";

function LoginForm(props: RLoginFormProps) {
    const { label, color, children, onSubmit } = props;
    const { handleSubmit, control } = useForm<LoginFields>();

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
