import { useForm } from "react-hook-form";
import { Box, Button, Card, Divider } from "@mui/material";

import { controlValidInput } from "@feria-a-ti/common/inputControl";
import { RFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { ConfirmRegisterFields } from "@feria-a-ti/common/model/registerFields";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./ConfirmRegisterForm.css";

function ConfirmRegisterForm(props: RFormProps) {
    const { children, onSubmit } = props;
    const { control, handleSubmit } = useForm<ConfirmRegisterFields>();

    return (
        <Card
            className="inputContainer"
            sx={{
                maxWidth: "50%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <h1 style={{ maxWidth: "100%" }}>Confirmar Registro</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box>
                    <InputComponentAlt
                        control={control}
                        name="code"
                        label="Ingresar código de confirmación"
                        type="text"
                        onChange={controlValidInput}
                        rules={{
                            required: "El código es requerido",
                            minLength: {
                                value: 6,
                                message: "El código posee 6 caracteres",
                            },
                            maxLength: {
                                value: 6,
                                message: "El código posee 6 caracteres",
                            },
                        }}
                    />
                </Box>
                <Box sx={{ margin: "1em" }}>
                    <Button
                        color="primary"
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

export default ConfirmRegisterForm;
