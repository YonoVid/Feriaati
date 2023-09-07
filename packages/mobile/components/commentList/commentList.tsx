import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { httpsCallable } from "@firebase/functions";

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

import { Avatar, DataTable, IconButton } from "react-native-paper";
import { CommentView } from "./commentView";
import { useAppContext } from "../../app/AppContext";
import { colors } from "@feria-a-ti/common/theme/base";
import CommentForm from "../forms/CommentForm";

export const CommentList = (props: RListCommentsProps) => {
    // Context variables
    const { authUser, authToken, setMessage } = useAppContext();

    const { label, color, children, isUser, commentsVendor } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [canSubmit, setCanSubmit] = useState(true);

    const [page, setPage] = useState(0);
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
                        console.log(msg);
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

    const uploadComment = (data: CommentFields) => {
        try {
            setCanSubmit(false);
            const formatedData: CommentFields = {
                comment: data.comment,
                userToken: authToken,
                vendorId: commentsVendor,
            };
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
        } catch (error) {
            console.error("Error al enviar comentario:", error);
        }
    };

    useEffect(() => {
        getComments();
    }, [commentsVendor]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "column" }}>
                <Text style={{ ...styles.title, flex: 6 }}>
                    {label != null ? label : "Comentarios"}
                </Text>
                {isUser && (
                    <CommentForm
                        canSubmit={canSubmit}
                        onSubmit={uploadComment}
                    />
                )}
            </View>
            <DataTable.Pagination
                page={page}
                numberOfPages={
                    comments ? Math.floor(comments.length / 3) + 1 : 1
                }
                onPageChange={(page) => page >= 0 && setPage(page)}
                label={`${page * 3 + 1}-${(page + 1) * 3} of ${
                    comments.length
                }`}
                showFastPaginationControls
                numberOfItemsPerPage={3}
            />
            <View style={{ flexDirection: "column" }}>
                {comments &&
                    comments
                        .slice(page * 3, (page + 1) * 3)
                        .map((data, index) => (
                            <CommentView
                                key={index}
                                comment={data}
                                onReport={
                                    isUser
                                        ? () => reportComment(data.id as string)
                                        : undefined
                                }
                            />
                        ))}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        padding: 8,
        margin: 20,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
    button: {
        marginTop: 35,
        alignContent: "center",
        color: colors.light,
        height: 40,
        backgroundColor: colors.secondaryShadow,
        borderRadius: 20,
    },
    buttonInner: {
        margin: 40,
        color: colors.primaryShadow,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    title: {
        marginVertical: 20,
        textAlign: "center",
        color: colors.primaryShadow,
        fontSize: 30,
        fontWeight: "bold",
        borderRadius: 4,
    },
});
