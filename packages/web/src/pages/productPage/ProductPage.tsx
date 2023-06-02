import { httpsCallable } from "firebase/functions";
import { Card, CardContent, Pagination, Typography } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";
import { useState } from "react";
const [currentPage, setCurrentPage] = useState(1);
const ProductListFunction = httpsCallable(functions, "productList");
ProductListFunction({ page: currentPage })
  .then((result) => {
    const { products, pageSize } = result.data as any;
    const handlePageChange = (event: any, page: any) => {
      setCurrentPage(page);
    };

    // se generan las cards con las frutas o verduras
    const productCards = products.map((product: any) => (
      <Card key={product.id}>
        <CardContent>
          <Typography variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography>{product.image}</Typography>
          <Typography color="text.primary">{product.description}</Typography>
          <Typography color="text.primary">{product.price}</Typography>
        </CardContent>
      </Card>
    ));
    const totalPages = Math.ceil(products.length / pageSize);
    // retorna las cards con los productos
    return (
      <>
        <div>{productCards}</div>;
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
        />
      </>
    );
  })

  .catch((error) => {
    // Manejar errores
    console.error(error);
  });
export default ProductListFunction;
