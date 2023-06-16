import { useForm } from "react-hook-form";
import { Box, Button, Card, Divider } from "@mui/material";

import { RFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { CommentFields } from "@feria-a-ti/common/model/comments/commentsFields";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import "./CommentForm.css";

function CommentForm(props: RFormProps) {
    const { canSubmit, onSubmit } = props;
    const { control, handleSubmit } = useForm<CommentFields>();

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "row" }}
        >
            <Box sx={{ flex: 6 }}>
                <InputComponentAlt
                    sx={{ width: "100%", maxWidth: "100%" }}
                    control={control}
                    name="comment"
                    multiline={true}
                    rows={5}
                    label="Danos tu opinión"
                    type="text"
                    rules={{
                        required: "El comentario no puede estar vacío",
                        maxLength: {
                            value: 254,
                            message: "El máximo de caracteres es 254",
                        },
                    }}
                />
            </Box>
            <Box sx={{ margin: "1em", flex: 6 }}>
                <Button
                    color="primary"
                    type="submit"
                    variant="contained"
                    disabled={canSubmit != null ? !canSubmit : false}
                >
                    Enviar
                </Button>
            </Box>
        </form>
    );
}

export default CommentForm;
