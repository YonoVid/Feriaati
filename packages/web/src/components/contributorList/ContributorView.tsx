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

import {
    ContributorData,
    userStatus,
} from "@feria-a-ti/common/model/functionsTypes";

import "./ContributorList.css";

export type ContributorViewProps = {
    contributor: ContributorData;
    sx?: SxProps<Theme>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const ContributorView = (props: ContributorViewProps) => {
    const { sx, contributor, onEdit, onDelete } = props;
    const { email, name, surname, status } = contributor;

    return (
        <>
            <Box sx={{ ...sx, display: "flex" }}>
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
                                {email +
                                    (status === userStatus.blocked
                                        ? " (DELETED)"
                                        : "")}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Nombre de usuario:&nbsp;
                                {name + " " + surname}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Contraseña{" "}
                                {status == userStatus.registered &&
                                    "por defecto"}
                                :&nbsp;
                                {status == userStatus.registered
                                    ? (email + "0").padEnd(10, "0")
                                    : "*".repeat(10)}
                            </Typography>
                        </CardContent>
                    </Box>
                    {status !== userStatus.blocked && (
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

export default ContributorView;
