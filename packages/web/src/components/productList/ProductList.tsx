import { useEffect, useState } from "react";

import { Box, Card, Divider, Pagination } from "@mui/material";
import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";
import { RProductListProps } from "@feria-a-ti/common/model/productListProps";

import ProductView from "./ProductView";
import "./ProductList.css";

function ProductList(props: RProductListProps) {
    const { label, color, children, products, onSubmit } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        const mockupProduct: ProductFields = {
            name: "Test",
            description: "Is a test of product views",
            price: 1000,
            discount: "none",
            promotion: 400,
            image: [
                "https://storage.googleapis.com/feria-a-ti.appspot.com/register/vendor/manolo%40correo.cl.png?GoogleAccessId=feria-a-ti%40appspot.gserviceaccount.com&Expires=16447017600&Signature=O5TXKKg%2FlfV9TcjaeQ7Q4JcfthLjuDS%2Ba%2B6fmRcC9CErkUFGmEThnD8BFfvFm6JhjaA04PKnKxjGvv4UcKR%2FU%2BNejmJLPFCkEwtjn5%2B%2BCtqqWZJarAghQ5ZVtlnnSVg9zzNogehRNbNuaqRXr6b6KDMBCci%2BS9UgrDUOnJYeZFU4ursRXEEd6Utp%2Fc6OD8Dd%2F1a8kL%2F0UQyUfyhVnNVyOJz%2B%2B5XPfviImG8ErQ1ouztDb91z64cf805r6bJBW185ILuqjy52Uk9CL%2Fu6TKBZW33GPBpopfHC3HksGTZaaVFpmz9Ye9SYkuWQjQkG3na1mteGg6cfXTFpVFds%2FhGEAA%3D%3D",
                "gs://feria-a-ti.appspot.com/register/vendor/manolo@correo.cl.png",
                "",
            ],
        };
        products.push(mockupProduct);
    }, [products]);

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "50%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <h1 style={{ maxWidth: "100%" }}>
                {label != null ? label : "Iniciar Sesion"}
            </h1>
            <Box>
                {products.map((product, index) => (
                    <ProductView key={product.name + index} product={product} />
                ))}
            </Box>
            <Divider />
            <Pagination count={10} page={page} onChange={handleChange} />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default ProductList;
