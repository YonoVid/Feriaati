import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Collapse,
    IconButton,
    IconButtonProps,
    styled,
    Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {
    ProductData,
    ProductUnit,
} from "@feria-a-ti/common/model/functionsTypes";
import "./ProductList.css";
import InputComponentAlt from "../inputComponent/InputComponentAlt";
import { numberRegex } from "@feria-a-ti/common/check/checkBase";
import { useForm } from "react-hook-form";
import { ShoppingCartItem } from "@feria-a-ti/common/model/props/shoppingCartProps";

export type ProductViewProps = {
    product: ProductData;
    vendorId?: string;
    isEditable: boolean;
    addProduct?: (data: ShoppingCartItem) => void;
    onEdit?: (product: ProductData) => void;
    onDelete?: (id: string) => void;
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const ProductView = (props: ProductViewProps) => {
    const { vendorId, product, isEditable, addProduct, onEdit, onDelete } =
        props;
    const {
        id,
        name,
        description,
        price,
        discount,
        promotion,
        image,
        unitType,
        unit,
    } = product;

    const { watch, setValue, handleSubmit, control } = useForm<{
        quantity: number;
    }>({ defaultValues: { quantity: 1 } });

    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [manualNumber, setManualNumber] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        setInterval(() => {
            let newIndex = imageIndex + 1;
            while (!image[newIndex] || image[newIndex] === "") {
                newIndex = newIndex + 1 > image.length - 1 ? 0 : newIndex + 1;
            }
            setImageIndex(newIndex);
        }, 3000);
    }, []);

    const onSubmit = () => {
        if (addProduct && product != null && product != undefined) {
            addProduct({
                id: { productId: product.id, vendorId: vendorId || "unknown" },
                value: product,
                quantity: Number(watch("quantity")),
            });
            setManualNumber(false);
        }
    };

    const unitLabel =
        "(" +
        (unitType === ProductUnit.GRAM
            ? unit + "gr."
            : unitType === ProductUnit.KILOGRAM
            ? "kg."
            : "unidad") +
        ")";
    const finalPrice =
        price -
        (discount !== "none"
            ? discount === "percentage"
                ? (price * promotion) / 100
                : promotion
            : 0);

    return (
        <Card sx={{ maxWidth: "16em" }}>
            <CardMedia
                component="img"
                height="175em"
                image={image[imageIndex].replace(
                    "storage.googleapis.com",
                    "localhost:9199"
                )}
                alt="Product image"
            />
            {addProduct && (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <Box
                            sx={{
                                alignItems: "center",
                                alignContent: "center",
                                marginTop: "auto",
                                marginBottom: "auto",
                            }}
                        >
                            <IconButton
                                aria-label="remover producto"
                                color="primary"
                                onClick={() =>
                                    !isNaN(Number(watch("quantity"))) &&
                                    watch("quantity") > 1 &&
                                    setValue("quantity", watch("quantity") - 1)
                                }
                            >
                                <RemoveCircleIcon />
                            </IconButton>
                            {manualNumber ? (
                                <InputComponentAlt
                                    sx={{
                                        flex: 1,
                                        minWidth: "3em",
                                        maxWidth: "4em",
                                    }}
                                    inputProps={{ maxLength: 3 }}
                                    control={control}
                                    name="quantity"
                                    label=""
                                    type="number"
                                    rules={{
                                        required: "La cantidad es requerida",
                                        maxLength: {
                                            value: 2,
                                            message: "El máximo valor es 99",
                                        },
                                        pattern: {
                                            value: numberRegex,
                                            message: "Valor debe ser numérico",
                                        },
                                    }}
                                />
                            ) : (
                                <Button
                                    color="inherit"
                                    variant="text"
                                    onClick={() => setManualNumber(true)}
                                >
                                    {watch("quantity")}
                                </Button>
                            )}
                            <IconButton
                                aria-label="editar producto"
                                color="secondary"
                                onClick={() =>
                                    !isNaN(Number(watch("quantity"))) &&
                                    watch("quantity") < 999 &&
                                    setValue(
                                        "quantity",
                                        Number(watch("quantity")) + 1
                                    )
                                }
                            >
                                <AddCircleIcon />
                            </IconButton>
                        </Box>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            Comprar
                        </Button>
                    </Box>
                </form>
            )}
            <CardActions disableSpacing>
                <CardHeader
                    title={"$" + finalPrice + " " + unitLabel}
                    subheader={
                        discount !== "none"
                            ? "Descuento de " +
                              (discount === "percentage"
                                  ? promotion + "%"
                                  : "$" + promotion)
                            : "Sin descuento"
                    }
                />
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardHeader title={name} />
                <CardContent>
                    <Typography paragraph>{description}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                    {isEditable ? (
                        <>
                            <IconButton
                                aria-label="editar producto"
                                onClick={() => onEdit && onEdit(props.product)}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                aria-label="eliminar producto"
                                onClick={() => onDelete && onDelete(id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton aria-label="add to favorites">
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                        </>
                    )}
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
            </Collapse>
        </Card>
    );
};

export default ProductView;
