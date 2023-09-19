import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    IconButton,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

import { colors } from "@feria-a-ti/common/theme/base";
import { UserComment } from "@feria-a-ti/common/model/functionsTypes";

import "./CommentList.css";
import { OpinionValue } from "@feria-a-ti/common/model/comments/commentsFields";

export type CommentViewProps = {
    comment: UserComment;
    sx?: SxProps<Theme>;
    onReport?: () => void;
};

export const CommentView = (props: CommentViewProps) => {
    const { sx, comment, onReport } = props;

    const color =
        comment.opinion == OpinionValue.POSITIVE
            ? colors.primary
            : colors.secondary;

    const colorShadow =
        comment.opinion == OpinionValue.POSITIVE ? colors.light : colors.light;

    return (
        <Card
            sx={{
                display: "flex",
                maxWidth: "90%",
                ...sx,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    shadow: 1,
                    backgroundColor: color,
                    flexDirection: "column",
                }}
            >
                <CardContent>
                    <Typography paragraph fontWeight={"bold"}>
                        {comment.username}
                    </Typography>
                </CardContent>
                {comment.opinion == OpinionValue.POSITIVE ? (
                    <ThumbUpIcon sx={{ fontSize: "3em", color: colorShadow }} />
                ) : (
                    <ThumbDownIcon
                        sx={{ fontSize: "3em", color: colorShadow }}
                    />
                )}
            </Box>
            <Box sx={{ flex: 5 }}>
                <CardContent>
                    <Typography paragraph>{comment.comment}</Typography>
                    <Box sx={{ flex: 1, flexDirection: "row" }}>
                        <IconButton
                            sx={{ alignContent: "end" }}
                            onClick={onReport}
                        >
                            <ReportGmailerrorredIcon />
                        </IconButton>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
};

export default CommentView;
