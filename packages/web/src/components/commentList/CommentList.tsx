import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { Box, Card, Divider, Pagination, Stack } from "@mui/material";

import {
    ResponseData,
    UserComment,
} from "@feria-a-ti/common/model/functionsTypes";
import { RListCommentsProps } from "@feria-a-ti/common/model/comments/listCommentsProps";
import { functions } from "@feria-a-ti/common/firebase";
import {
    CommentFields,
    GetCommentsFields,
    ReportCommentFields,
} from "@feria-a-ti/common/model/comments/commentsFields";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderLayout";

import CommentForm from "../forms/commentForm/CommentForm";
import CommentView from "./CommentView";
import "./CommentList.css";
import { UserContext } from "../../App";
import { stringRegex } from "@feria-a-ti/common/check/checkBase";

function CommentList(props: RListCommentsProps) {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, authUser } = useContext(UserContext);

    const { label, color, children, isUser, commentsVendor } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [canSubmit, setCanSubmit] = useState(true);

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    // Data of comments stored
    const [comments, setComments] = useState<UserComment[]>([]);

    const getComments = () => {
        try {
            setCanSubmit(false);
            const formatedData: GetCommentsFields = {
                token: authToken,
                id: commentsVendor ? commentsVendor : authUser,
            };
            console.log("GET COMMENTS::", commentsVendor);
            const get = httpsCallable<
                GetCommentsFields,
                ResponseData<Array<UserComment>>
            >(functions, "getComments");
            get(formatedData)
                .then((result) => {
                    const { extra, msg, error } = result.data;
                    console.log(result);
                    if (error) {
                        console.log("LOAD COMMENTS ERROR::", msg);
                    } else {
                        setComments(extra);
                    }
                })
                .finally(() => setCanSubmit(true));
        } catch (error) {
            console.error("Error al obtener los comentarios:", error);
        }
    };

    const reportComment = (id: string) => {
        try {
            setCanSubmit(false);
            console.log("REPORT COMMENT::", id);
            const report = httpsCallable<
                ReportCommentFields,
                ResponseData<string>
            >(functions, "reportComment");
            report({
                userToken: authToken as string,
                commentId: id,
                vendorId: commentsVendor,
            })
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    setMessage({ msg: msg, isError: error });
                })
                .finally(() => setCanSubmit(true));
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const uploadComment = (data: FieldValues) => {
        try {
            setCanSubmit(false);
            const formatedData: CommentFields = {
                comment: data.comment,
                userToken: authToken,
                vendorId: commentsVendor,
            };
            const check = stringRegex.test(data.comment);
            if (check) {
                const upload = httpsCallable<
                    CommentFields,
                    ResponseData<UserComment>
                >(functions, "addComment");
                console.log("UPLOAD COMMENT::", formatedData);
                upload(formatedData)
                    .then((result) => {
                        const { msg, error, extra } = result.data;
                        console.log(result);

                        setMessage({ msg: msg, isError: error });
                        !error && setComments([extra, ...comments]);
                    })
                    .finally(() => setCanSubmit(true));
            }
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    useEffect(() => {
        if (commentsVendor && commentsVendor !== "") {
            getComments();
        }
    }, [commentsVendor]);

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "80%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            {isUser && (
                <CommentForm canSubmit={canSubmit} onSubmit={uploadComment} />
            )}
            <h1 style={{ maxWidth: "100%" }}>
                {label != null ? label : "Comentarios"}
            </h1>
            <Stack
                direction={"column"}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {comments &&
                    comments
                        .slice((page - 1) * 3, page * 3)
                        .map((data, index) => (
                            <CommentView
                                sx={{ width: "100%" }}
                                key={index}
                                comment={data}
                                onReport={
                                    isUser
                                        ? () =>
                                              canSubmit &&
                                              reportComment(data.id as string)
                                        : undefined
                                }
                            />
                        ))}
            </Stack>
            <Divider />
            <Pagination
                count={comments ? Math.floor(comments.length / 3) + 1 : 1}
                page={page}
                onChange={handleChange}
                sx={{
                    maxWidth: "100%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default CommentList;
