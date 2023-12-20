import "react-native-get-random-values";
import React from "react";

import { StyleSheet } from "react-native";
import { Avatar, Text, Button, Card, IconButton } from "react-native-paper";

import { colors } from "@feria-a-ti/common/theme/base";

import { ContributorData } from "@feria-a-ti/common/model/functionsTypes";

export type ContributorViewProps = {
    contributor: ContributorData;
    // sx?: SxProps<Theme>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const ContributorView = (props: ContributorViewProps) => {
    const { contributor, onEdit, onDelete } = props;
    const { email, name, surname, status } = contributor;
    const isEditable = true;

    return (
        <Card>
            <Card.Title
                title={name + " " + surname}
                subtitle={email}
                // left={(props) => (
                //     <Avatar.Image
                //         {...props}
                //         size={50}
                //         source={{
                //             uri: image[imageIndex].replace(
                //                 "127.0.0.1",
                //                 "192.168.0.12"
                //             ),
                //         }}
                //     />
                // )}
            />
            <Card.Actions>
                <>
                    <IconButton
                        icon="pencil"
                        size={20}
                        onPress={() => onEdit()}
                    />
                    <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => onDelete()}
                    />
                </>
            </Card.Actions>
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
