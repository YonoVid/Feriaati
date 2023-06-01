import { httpsCallable } from "firebase/functions";
import { Card, CardContent, Typography } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";

const productListFunction = httpsCallable(functions, "productList");
productListFunction()
  .then((result) => {
    const products = result.data as any;

    // se generan las tarjetas con las frutas o verduras
    const productCards = products.map((product: any) => (
      <Card key={product.id}>
        <CardContent>
          <Typography variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography color="text.secondary">{product.image}</Typography>
          <Typography color="text.secondary">{product.description}</Typography>
          <Typography color="text.secondary">{product.price}</Typography>
        </CardContent>
      </Card>
    ));

    // retorna las cards con los productos
    return <div>{productCards}</div>;
  })
  .catch((error) => {
    // Manejar errores
    console.error(error);
  });
