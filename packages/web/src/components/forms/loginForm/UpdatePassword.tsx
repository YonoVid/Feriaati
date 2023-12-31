import { useForm } from "react-hook-form";
import { Box, Button, Card, Divider } from "@mui/material";

import { RUpdatepPassFormProps } from "@feria-a-ti/common/model/props/loginFormProps";
import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./LoginForm";
import { UpdatePassFields } from "@feria-a-ti/common/model/fields/loginFields";

function UpdatePassForm(props: RUpdatepPassFormProps) {
    const { label, color, children, onSubmit } = props;
    const { control, watch, handleSubmit } = useForm<UpdatePassFields>();

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
                {label != null ? label : "Intoduce una nueva contraseña"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="codigo"
                        label="Código de validación"
                        type="text"
                        rules={{
                            required: "El código es requerido",
                            minLength: {
                                value: 6,
                                message: "El código debe tener 6 caracters",
                            },
                            maxLength: {
                                value: 6,
                                message: "El código debe tener 6 caracters",
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
                        Actualizar contraseña
                    </Button>
                </Box>
            </form>
            <Divider />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default UpdatePassForm;
