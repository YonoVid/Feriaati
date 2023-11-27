import { useState } from "react";
import { Box, Card, Divider, Pagination, Stack } from "@mui/material";

import { ListProductVendorProps } from "@feria-a-ti/common/model/vendors/listVendorProps";

import { ProductVendorView } from "./ProductVendorView";
import "./ProductVendorList.css";

function ProductVendorList(props: ListProductVendorProps) {
    const { color, children, productVendors, onEdit, onDelete } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(event);
        setPage(value);
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
            <Stack
                direction={"column"}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {productVendors &&
                    productVendors
                        .slice((page - 1) * 3, page * 3)
                        .map((data, index) => (
                            <ProductVendorView
                                sx={{ width: "100%" }}
                                key={index}
                                productVendor={data}
                                onEdit={() => onEdit(data)}
                                onDelete={() => onDelete(data.id)}
                            />
                        ))}
            </Stack>
            <Divider />
            <Pagination
                count={
                    productVendors
                        ? Math.floor(productVendors.length / 3) + 1
                        : 1
                }
                page={page}
                onChange={handleChange}
                sx={{
                    maxWidth: "100%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductVendorList;
