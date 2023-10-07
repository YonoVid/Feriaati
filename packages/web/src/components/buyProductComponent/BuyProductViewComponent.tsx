import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";

import { ProductFactureData } from "@feria-a-ti/common/model/functionsTypes";
import "./BuyProductViewComponent.css";

export type BuyProductViewComponentProps = {
    product: ProductFactureData;
};

export const BuyProductViewComponent = (
    props: BuyProductViewComponentProps
) => {
    const { product } = props;
    const { id, name, quantity, subtotal } = product;

    return (
        <Card sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Card sx={{ display: "flex", flex: 4 }}>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="div" variant="h5">
                                {name}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                {"$" + subtotal / quantity}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
                <Card sx={{ display: "flex", flexDirection: "row", flex: 2 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                            {"Cantidad:" + quantity}
                        </Typography>
                        <Typography variant="h6" color="text.primary">
                            {"$" + subtotal}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <Typography component="div" variant="subtitle1">
                {id}
            </Typography>
        </Card>
    );
};

export default BuyProductViewComponent;
