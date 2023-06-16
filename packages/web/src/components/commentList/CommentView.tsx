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
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

import { colors } from "@feria-a-ti/common/theme/base";
import { UserComment } from "@feria-a-ti/common/model/functionsTypes";

import "./CommentList.css";

export type CommentViewProps = {
    comment: UserComment;
    sx?: SxProps<Theme>;
    onReport?: () => void;
};

export const CommentView = (props: CommentViewProps) => {
    const { sx, comment, onReport } = props;

    return (
        <Card sx={{ display: "flex", maxWidth: "90%", ...sx }}>
            <Box sx={{ flex: 1, shadow: 1, backgroundColor: colors.primary }}>
                <CardContent>
                    <Typography paragraph fontWeight={"bold"}>
                        {comment.username}
                    </Typography>
                </CardContent>
                <IconButton onClick={onReport}>
                    <ReportGmailerrorredIcon />
                </IconButton>
            </Box>
            <Box sx={{ flex: 5 }}>
                <CardContent>
                    <Typography paragraph>{comment.comment}</Typography>
                </CardContent>
            </Box>
        </Card>
    );
};

export default CommentView;
