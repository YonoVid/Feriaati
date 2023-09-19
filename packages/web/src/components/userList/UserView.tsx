import {
    Box,
    Card,
    CardContent,
    IconButton,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { colors } from "@feria-a-ti/common/theme/base";
import { UserData } from "@feria-a-ti/common/model/functionsTypes";

import "./UserList.css";

export type UserViewProps = {
    user: UserData;
    sx?: SxProps<Theme>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const UserView = (props: UserViewProps) => {
    const { sx, user, onEdit, onDelete } = props;
    const { email, password, username, isDeleted } = user;

    return (
        <>
            <Box sx={{ display: "flex" }}>
                <Card
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 6,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            marginX: 5,
                        }}
                    >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="div" variant="h5">
                                {email + (isDeleted ? " (DELETED)" : "")}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Nombre de usuario:&nbsp;
                                {username}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                {"*".repeat(password.length)}
                            </Typography>
                        </CardContent>
                    </Box>
                    {!isDeleted && (
                        <Box
                            sx={{
                                display: "flex",
                                margin: 1,
                                alignItems: "center",
                                float: "ltr",
                                pl: 1,
                                pb: 1,
                            }}
                        >
                            <IconButton
                                aria-label="previous"
                                color="warning"
                                onClick={() => onEdit && onEdit()}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                aria-label="next"
                                color="error"
                                onClick={() => onDelete && onDelete()}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    )}
                </Card>
            </Box>
        </>
    );
};

export default UserView;
