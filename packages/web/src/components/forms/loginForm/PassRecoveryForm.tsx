import { useForm } from "react-hook-form";
import { Box, Button, Card, Divider } from "@mui/material";

import { emailFormatRegex } from "@feria-a-ti/common/check/checkLoginFields";
import { RRecoveryFormProps } from "@feria-a-ti/common/model/loginFormProps";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./LoginForm.css";
import { RecoveryFields } from "@feria-a-ti/common/model/loginFields";

function RecoveryForm(props: RRecoveryFormProps) {
    const { label, color, children, onSubmit } = props;
    const { control, handleSubmit } = useForm<RecoveryFields>();

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
                {label != null ? label : "Recuperar Contraseña"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="email"
                        label="Correo electrónico de cuenta"
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
                <Box sx={{ margin: "1em" }}>
                    <Button
                        color={colorTheme}
                        type="submit"
                        variant="contained"
                        disabled={
                            props.canSubmit != null ? !props.canSubmit : false
                        }
                    >
                        Recuperar contraseña
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default RecoveryForm;
