import { httpsCallable } from "firebase/functions";
import { Card, CardContent, Typography } from "@mui/material";
import { functions } from "@feria-a-ti/common/firebase";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from "react";

const productListFunction = httpsCallable(functions, "productList");
productListFunction()
  .then((result) => {
    const products = result.data as any;

    // se generan las tarjetas con las frutas o verduras
    const productCards = products.map(
      (product: {
        id: Key | null | undefined;
        name:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
        image:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
        description:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
        price:
          | string
          | number
          | boolean
          | ReactElement<any, string | JSXElementConstructor<any>>
          | ReactFragment
          | ReactPortal
          | null
          | undefined;
      }) => (
        <Card key={product.id}>
          <CardContent>
            <Typography variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography color="text.secondary">{product.image}</Typography>
            <Typography color="text.secondary">
              {product.description}
            </Typography>
            <Typography color="text.secondary">{product.price}</Typography>
          </CardContent>
        </Card>
      )
    );

    // Renderizar las tarjetas en tu página
    return <div>{productCards}</div>;
  })
  .catch((error) => {
    // Manejar errores
    console.error(error);
  });
