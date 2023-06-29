import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    Divider,
    Pagination,
    Stack,
    TextField,
} from "@mui/material";
import {
    ShoppingCartItem,
    ShoppingCartProps,
} from "@feria-a-ti/common/model/props/shoppingCartProps";
import {
    ProductData,
    ProductDiscount,
} from "@feria-a-ti/common/model/functionsTypes";

import "./ShoppingCartComponent.css";
import CartProductView from "./CartProductView";

function ShoppingCartComponent(props: ShoppingCartProps) {
    const { label, color, children, products, isEditable, onEdit, onDelete } =
        props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

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
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ShoppingCartComponent;
