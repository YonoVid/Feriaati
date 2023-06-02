import { useEffect, useState } from "react";
import {
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { ProductData } from "@feria-a-ti/common/model/functionsTypes";
import "./ProductList.css";

export type ProductViewProps = {
    product: ProductData;
    isEditable: boolean;
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
    const { isEditable, onEdit, onDelete } = props;
    const { id, name, description, price, discount, promotion, image } =
        props.product;

    const [expanded, setExpanded] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

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

    const finalPrice =
        price -
        (discount !== "none"
            ? discount === "percentage"
                ? (price * promotion) / 100
                : promotion
            : 0);

    return (
        <Card sx={{ maxWidth: "12em" }}>
            <CardMedia
                component="img"
                height="175em"
                image={image[imageIndex].replace(
                    "storage.googleapis.com",
                    "localhost:9199"
                )}
                alt="Product image"
            />
            <CardActions disableSpacing>
                <CardHeader
                    title={"$" + finalPrice}
                    subheader={
                        discount !== "none" &&
                        "Descuento de " +
                            (discount === "percentage"
                                ? promotion + "%"
                                : "$" + promotion)
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
