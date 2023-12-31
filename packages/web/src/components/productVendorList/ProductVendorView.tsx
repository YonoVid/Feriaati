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

import { ProductListCollectionData } from "@feria-a-ti/common/model/functionsTypes";

import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import "./ProductVendorView.css";

export type ProductVendorViewProps = {
    productVendor: ProductListCollectionData;
    sx?: SxProps<Theme>;
    onEdit?: () => void;
    onDelete?: () => void;
};

export const ProductVendorView = (props: ProductVendorViewProps) => {
    const { sx, productVendor, onEdit, onDelete } = props;
    const {
        enterpriseName,
        region,
        commune,
        serviceTime,
        contact,
        image,
        isDeleted,
    } = productVendor;

    return (
        <>
            <Box sx={{ ...sx, display: "flex" }}>
                <Card sx={{ display: "flex", flex: 6 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: "15em" }}
                        image={image.replace(
                            "storage.googleapis.com",
                            "localhost:9199"
                        )}
                        alt={"Item image"}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="div" variant="h5">
                                {enterpriseName +
                                    (isDeleted ? " (DELETED)" : "")}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Zona de atención:
                                {(region ? regionCode[region - 1][1] : "") +
                                    ", " +
                                    (region && commune
                                        ? regionCommune[region].find(
                                              (el: string | number[]) =>
                                                  el[0] === commune
                                          )[1]
                                        : "")}
                            </Typography>
                            <h5>
                                Horario de atención:
                                {serviceTime &&
                                    (serviceTime?.start.hours
                                        .toString()
                                        .padStart(2, "0") +
                                        ":" +
                                        serviceTime?.start.minutes
                                            .toString()
                                            .padStart(2, "0") || "") +
                                        "-" +
                                        (serviceTime?.end.hours
                                            .toString()
                                            .padStart(2, "0") +
                                            ":" +
                                            serviceTime?.end.minutes
                                                .toString()
                                                .padStart(2, "0") || "")}
                            </h5>
                            <h5>
                                Método de contacto:
                                {(contact &&
                                    contact?.phone + "-" + contact?.email) ||
                                    "-"}
                            </h5>
                        </CardContent>
                        {!isDeleted && (
                            <Box
                                sx={{
                                    display: "flex",
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
                    </Box>
                </Card>
            </Box>
        </>
    );
};

export default ProductVendorView;
