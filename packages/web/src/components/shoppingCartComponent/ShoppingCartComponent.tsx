import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { ShoppingCartProps } from "@feria-a-ti/common/model/props/shoppingCartProps";

import "./ShoppingCartComponent.css";
import CartProductView from "./CartProductView";

function ShoppingCartComponent(props: ShoppingCartProps) {
    const { color, children, products, canSubmit, onEdit, onDelete, onSubmit } =
        props;

    const [total, setTotal] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        let newTotal = 0;
        if (products) {
            products.forEach((item) => {
                let finalPrice = item.value.price;
                if (
                    item.value.discount != undefined &&
                    item.value.discount != null &&
                    item.value.promotion != undefined &&
                    item.value.promotion != null &&
                    item.value?.discount != "none"
                ) {
                    finalPrice -=
                        item.value.discount == "percentage"
                            ? (finalPrice * item.value.promotion) / 100
                            : item.value.promotion;
                }
                newTotal += item.quantity * finalPrice;
            });
            setTotal(newTotal);
        }
    }, [products]);

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "80%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <Stack
                direction={{ xs: "column" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {products.map((product, index) => (
                    <CartProductView
                        onEdit={(quantity) =>
                            onEdit && onEdit(product.id, quantity)
                        }
                        onDelete={() => onDelete && onDelete(product.id)}
                        key={product.value.name + index}
                        product={product.value}
                        quantity={product.quantity}
                    />
                ))}
            </Stack>
            <Card>
                <CardContent>
                    <Typography
                        sx={{ fontSize: 25 }}
                        color="text.primary"
                        gutterBottom
                    >
                        {"TOTAL: $" + total}
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ margin: "1em" }}>
                <Button
                    color="primary"
                    variant="contained"
                    type="button"
                    disabled={!canSubmit}
                    onClick={onSubmit}
                >
                    Realizar Comprar
                </Button>
            </Box>
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ShoppingCartComponent;
