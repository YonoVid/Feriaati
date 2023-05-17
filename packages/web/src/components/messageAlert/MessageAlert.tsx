import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export enum MessageType {
    INFO,
    CONTROL,
}

export type MessageAlertProps = {
    open: boolean;
    title: string;
    message: string;
    type?: MessageType;
    handleClose?: () => void;
};

function MessageAlert(props: MessageAlertProps) {
    const { open, title, message, handleClose } = props;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {(props.type == MessageType.CONTROL && (
                    <>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose} autoFocus>
                            Agree
                        </Button>
                    </>
                )) || <Button onClick={handleClose}>OK</Button>}
            </DialogActions>
        </Dialog>
    );
}

export default MessageAlert;
