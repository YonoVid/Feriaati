import { useState } from "react";

import {
    Box,
    Button,
    Card,
    Divider,
    Pagination,
    Stack,
    TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { RProductListProps } from "@feria-a-ti/common/model/props/productListProps";
import { ProductData } from "@feria-a-ti/common/model/functionsTypes";

import ProductView from "./ProductView";
import "./ProductList.css";

function ProductList(props: RProductListProps) {
    const {
        vendorId,
        label,
        color,
        children,
        products,
        filter,
        isEditable,
        addProduct,
        onAdd,
        onEdit,
        onDelete,
    } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [filterVendor, setFilterVendor] = useState<string | null>();

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(event);
        setPage(value);
    };

    const getList = (): ProductData[] => {
        if (filterVendor && filterVendor != null && filter != "") {
            return products.filter((value: any) =>
                value.name.toUpperCase().includes(filterVendor.toUpperCase())
            );
        }
        return products;
    };

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
            <h1 style={{ maxWidth: "100%" }}>
                {label != null ? label : "Iniciar Sesion"}
            </h1>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Pagination
                    count={Math.floor(products.length / 3) + 1}
                    page={page}
                    onChange={handleChange}
                    sx={{
                        flex: 2,
                        maxWidth: "100%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                />
                <TextField
                    sx={{ flex: 1 }}
                    label="Filtro"
                    variant="outlined"
                    onChange={(event) => setFilterVendor(event.target.value)}
                />
            </Box>
            <Divider />
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {getList()
                    .slice((page - 1) * 3, page * 3)
                    .map((product, index) => (
                        <ProductView
                            vendorId={vendorId}
                            onEdit={() => onEdit && onEdit(product)}
                            addProduct={addProduct}
                            onDelete={() => onDelete && onDelete(product.id)}
                            isEditable={isEditable}
                            key={product.name + index}
                            product={product}
                        />
                    ))}
                {isEditable && (
                    <Button
                        color="secondary"
                        type="button"
                        variant="contained"
                        onClick={onAdd}
                        startIcon={<AddIcon />}
                    >
                        Agregar producto
                    </Button>
                )}
            </Stack>
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductList;
