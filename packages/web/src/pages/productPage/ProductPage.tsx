import { httpsCallable } from "firebase/functions";
import {
    Card,
    CardContent,
    Pagination,
    TextField,
    Typography,
} from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";

import { useEffect, useState } from "react";

export const ProductPage = () => {
    const [product, setProduct] = useState<Array<any>>();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [filterValue, setFilterValue] = useState("");
    const [pageSize, setPageSize] = useState(10);

    const productListFunction = httpsCallable(
        functions,
        "productListPagination"
    );
    const filterProductListFunction = httpsCallable(
        functions,
        "filterProductList"
    );

    const fetchProducts = async () => {
        try {
            const result = await productListFunction({ page: currentPage });
            const { products, pageSize } = result.data as any;
            const totalPages = Math.ceil(products.length / pageSize);

            setTotalPages(totalPages);
            setProduct(products);
            setPageSize(pageSize);
        } catch (error) {
            console.error(error);
            // Manejar errores
        }
    };

    const fetchFilteredProducts = async () => {
        try {
            const result = await filterProductListFunction({
                productName: filterValue,
            });
            const products = result.data as any;
            const totalPages = Math.ceil(products.length / pageSize);

            setTotalPages(totalPages);
            setProduct(products);
        } catch (error) {
            console.error(error);
            // Manejar errores
        }
    };

    useEffect(() => {
        if (filterValue !== "") {
            fetchFilteredProducts();
        } else {
            fetchProducts();
        }
    }, [filterValue, currentPage]);

    const handlePageChange = (event: any, page: number) => {
        console.log("EVENT::", event);
        setCurrentPage(page);
    };

    const handleFilterChange = (event: any) => {
        setFilterValue(event.target.value);
        setCurrentPage(1); // Reiniciar a la primera página al aplicar un filtro
    };

    return (
        <>
            <TextField
                label="Filtrar por nombre"
                variant="standard"
                value={filterValue}
                onChange={handleFilterChange}
            />
            {product &&
                product.map((product: any) => (
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
            {product && product.length === 0 && (
                <Typography variant="body1" component="div">
                    No se encontraron productos.
                </Typography>
            )}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
            />
        </>
    );
};

export default ProductPage;
