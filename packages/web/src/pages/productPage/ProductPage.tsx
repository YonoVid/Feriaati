import { httpsCallable } from "firebase/functions";
import { Card, CardContent, Pagination, Typography } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";
import React, { useState } from "react";

export const ProductPage = () => {
    const [products, setProducts] = useState<Array<any>>();
    const productListFunction = httpsCallable(functions, "productList");

    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    productListFunction()
        .then((result) => {
            const products = result.data as Array<any>;
            // se generan las tarjetas con las frutas o verduras
            setProducts(products);
        })
        .catch((error) => {
            // Manejar errores
            console.error(error);
        });

    return (
        <>
            {products &&
                products.map((product: any) => (
                    <Card key={product.id}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {product.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {product.image}
                            </Typography>
                            <Typography color="text.secondary">
                                {product.description}
                            </Typography>
                            <Typography color="text.secondary">
                                {product.price}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            <Pagination count={10} page={page} onChange={handleChange} />
        </>
    );
};

export default ProductPage;
