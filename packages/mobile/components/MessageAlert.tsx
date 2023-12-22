import React from "react";
import {
    Button,
    Dialog,
    Portal,
    PaperProvider,
    Text,
} from "react-native-paper";

export type MessageAlertProps = {
    open: boolean;
    title: string;
    message: string;
    handleClose?: () => void;
};

export function MessageAlert(props: MessageAlertProps) {
    const { open, title, message, handleClose } = props;
    return (
        <Portal>
            <Dialog visible={open} onDismiss={handleClose}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">{message}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleClose}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
