import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { colors } from "@feria-a-ti/common/theme/base";
import {
    ProductListCollectionData,
    UserComment,
    VendorCollectionData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";

import "./VendorList.css";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

export type VendorViewProps = {
    vendor: VendorData;
    sx?: SxProps<Theme>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const VendorView = (props: VendorViewProps) => {
    const { sx, vendor, onEdit, onDelete } = props;
    const { email, password, name, surname, image, isDeleted } = vendor;

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
                    <CardMedia
                        component="img"
                        sx={{ width: "15em" }}
                        image={image.replace(
                            "storage.googleapis.com",
                            "localhost:9199"
                        )}
                        alt={"Item image"}
                    />
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
                                Nombre de Vendedor:&nbsp;
                                {name + " " + surname}
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

export default VendorView;
