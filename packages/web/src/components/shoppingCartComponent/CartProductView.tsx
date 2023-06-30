import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DeleteIcon from "@mui/icons-material/Delete";

import { ProductCollectionData } from "@feria-a-ti/common/model/functionsTypes";
import "./CartProductView.css";

export type CartProductViewProps = {
    product: ProductCollectionData;
    quantity: number;
    onEdit: (quantity: number) => void;
    onDelete: () => void;
};

export const CartProductView = (props: CartProductViewProps) => {
    const theme = useTheme();
    const { quantity, product, onEdit, onDelete } = props;
    const { name, price, discount, promotion, image } = product;

    const [localQuantity, setLocalQuantity] = useState(quantity);
    const [finalPrice, setFinalPrice] = useState(
        price -
            (discount !== "none"
                ? discount === "percentage"
                    ? (price * promotion) / 100
                    : promotion
                : 0)
    );
    const [subtotal, setSubtotal] = useState(finalPrice * localQuantity);

    useEffect(() => {
        setFinalPrice(
            price -
                (discount !== "none"
                    ? discount === "percentage"
                        ? (price * promotion) / 100
                        : promotion
                    : 0)
        );
        setSubtotal(finalPrice * localQuantity);
    }, [product, localQuantity]);

    return (
        <Box sx={{ display: "flex" }}>
            <Card sx={{ display: "flex", flex: 6 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={image[0].replace(
                        "storage.googleapis.com",
                        "localhost:9199"
                    )}
                    alt={"Item image"}
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flex: "1 0 auto" }}>
                        <Typography component="div" variant="h5">
                            {name}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                            component="div"
                        >
                            {"$" +
                                price +
                                "| " +
                                (discount !== "none" &&
                                    "Descuento de " +
                                        (discount === "percentage"
                                            ? promotion + "%"
                                            : "$" + promotion))}
                        </Typography>
                    </CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 1,
                            pb: 1,
                        }}
                    >
                        <IconButton
                            aria-label="previous"
                            color="secondary"
                            onClick={() => {
                                const actual = localQuantity;
                                if (localQuantity > 1) {
                                    setLocalQuantity(actual - 1);
                                    onEdit(actual - 1);
                                }
                            }}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            component="div"
                        >
                            {localQuantity}
                        </Typography>
                        <IconButton
                            aria-label="next"
                            color="primary"
                            onClick={() => {
                                const actual = localQuantity;
                                if (localQuantity < 999) {
                                    setLocalQuantity(actual + 1);
                                    onEdit(actual + 1);
                                }
                            }}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
            <Card sx={{ display: "flex", flex: 2 }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {"Cantidad:" + localQuantity}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                        {"$" + subtotal}
                    </Typography>
                    <IconButton
                        aria-label="eliminar producto"
                        onClick={() => onDelete && onDelete()}
                    >
                        <DeleteIcon />
                    </IconButton>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CartProductView;
