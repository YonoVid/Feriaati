import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Box, Button, IconButton } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { RFormProps } from "@feria-a-ti/common/model/props/registerFormProps";
import {
    CommentFields,
    OpinionValue,
} from "@feria-a-ti/common/model/comments/commentsFields";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import { stringRegex } from "@feria-a-ti/common/check/checkBase";
import "./CommentForm.css";

const colorDict = {
    [OpinionValue.NONE]: "none",
    [OpinionValue.POSITIVE]: "secondary.main",
    [OpinionValue.NEGATIVE]: "primary.main",
};

const inverseColorDict = {
    [OpinionValue.NONE]: "none",
    [OpinionValue.POSITIVE]: "primary.contrastText",
    [OpinionValue.NEGATIVE]: "primary.contrastText",
};

function CommentForm(props: RFormProps) {
    // Call global variables

    const { comment, canSubmit, onSubmit } = props;
    const { control, clearErrors, setValue, handleSubmit } =
        useForm<CommentFields>();

    const [opinion, setOpinion] = useState<OpinionValue>(OpinionValue.NONE);

    const selectedIcon = {
        color: "primary.contrastText",
        border: 1,
        borderColor: "primary.contrastText",
    };

    const changeOpinion = (value: OpinionValue) => {
        let newValue = value;
        if (opinion == value) {
            newValue = OpinionValue.NONE;
        }
        setOpinion(newValue);
        setValue("opinion", newValue);
        clearErrors();
    };

    useEffect(() => {
        if (comment && comment != null) {
            setValue("comment", comment.comment);
            changeOpinion(comment.opinion);
        }
        console.log(comment);
    }, [comment]);

    return (
        <Box
            sx={{
                border: 1,
                borderColor: "primary",
                margin: "2em",
                backgroundColor: colorDict[opinion],
            }}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    display: "flex",
                    flexDirection: "row",
                }}
            >
                <Box
                    sx={{
                        margin: "1em",
                        flex: 2,
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <IconButton
                        className="iconButton"
                        sx={
                            opinion == OpinionValue.POSITIVE ? selectedIcon : {}
                        }
                        color="secondary"
                        onClick={() => changeOpinion(OpinionValue.POSITIVE)}
                    >
                        <ThumbUpIcon sx={{ fontSize: "2em" }} />
                    </IconButton>
                    <IconButton
                        className="iconButton"
                        sx={
                            opinion == OpinionValue.NEGATIVE ? selectedIcon : {}
                        }
                        color="primary"
                        onClick={() => changeOpinion(OpinionValue.NEGATIVE)}
                    >
                        <ThumbDownIcon sx={{ fontSize: "2em" }} />
                    </IconButton>
                </Box>
                <InputComponentAlt
                    sx={{ display: "none" }}
                    control={control}
                    name="opinion"
                    label="Opinión"
                    type="text"
                    rules={{
                        required:
                            "Se debe señalar si la opinión es positiva o negativa",
                    }}
                />
                <Box sx={{ flex: 6 }}>
                    <InputComponentAlt
                        sx={{
                            width: "100%",
                            maxWidth: "100%",
                            backgroundColor: inverseColorDict[opinion],
                        }}
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
                            pattern: {
                                value: stringRegex,
                                message:
                                    "No se aceptan caracteres especiales (Ej: <,>,+,-,etc.)",
                            },
                            validate: () =>
                                opinion != OpinionValue.NONE ||
                                "Se debe señalar si la opinión es positiva o negativa",
                        }}
                    />
                </Box>
                <Box
                    sx={{
                        flex: 2,
                        flexDirection: "column",
                        justifyContent: "center",
                        margin: "auto",
                        marginX: "1em",
                        alignContent: "stretch",
                    }}
                >
                    <Button
                        sx={{ flex: 1 }}
                        color={
                            opinion != OpinionValue.NEGATIVE
                                ? "primary"
                                : "secondary"
                        }
                        type="submit"
                        variant="contained"
                        disabled={canSubmit != null ? !canSubmit : false}
                    >
                        {comment && comment != null ? "Editar" : "Enviar"}
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default CommentForm;
