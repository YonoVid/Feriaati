import { useEffect, useState } from "react";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { ShoppingCartProps } from "@feria-a-ti/common/model/props/shoppingCartProps";

import "./ShoppingCartComponent.css";
import CartProductView from "./CartProductView";

function ShoppingCartComponent(props: ShoppingCartProps) {
    const { label, color, children, products, isEditable, onEdit, onDelete } =
        props;

    const [total, setTotal] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        let newTotal = 0;
        products.forEach((item) => {
            const finalPrice =
                item.value.price -
                (item.value.discount !== "none"
                    ? item.value.discount === "percentage"
                        ? (item.value.price * item.value.promotion) / 100
                        : item.value.promotion
                    : 0);
            newTotal += item.quantity * finalPrice;
        });
        setTotal(newTotal);
    }, []);

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
                        onEdit={(quantity) => onEdit && onEdit(index, quantity)}
                        onDelete={() => onDelete && onDelete(index)}
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
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ShoppingCartComponent;
