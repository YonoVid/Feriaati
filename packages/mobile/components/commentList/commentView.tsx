import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet } from "react-native";

import { colors } from "@feria-a-ti/common/theme/base";
import { UserComment } from "@feria-a-ti/common/model/functionsTypes";

import {
    Avatar,
    Text,
    Button,
    Card,
    IconButton,
    Divider,
} from "react-native-paper";

export type CommentViewProps = {
    comment: UserComment;
    // sx?: SxProps<Theme>;
    onReport?: () => void;
};

export const CommentView = (props: CommentViewProps) => {
    const { comment, onReport } = props;

    return (
        <Card>
            <Card.Actions>
                <Text
                    style={{
                        backgroundColor: colors.primary,
                        width: onReport ? "80%" : "100%",
                    }}
                >
                    {comment.username}:
                </Text>
                {onReport && (
                    <IconButton
                        icon={"alert-octagon"}
                        size={20}
                        onPress={onReport}
                    />
                )}
            </Card.Actions>
            <Card.Content>
                <View
                    style={{
                        flexDirection: "column",
                    }}
                >
                    <Text
                        style={{
                            maxWidth: "90%",
                            justifyContent: "space-around",
                        }}
                    >
                        {comment.comment}
                    </Text>
                </View>
            </Card.Content>
        </Card>
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
