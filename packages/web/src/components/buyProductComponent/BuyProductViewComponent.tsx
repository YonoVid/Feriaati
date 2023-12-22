import { Box, Card, CardContent, Typography } from "@mui/material";

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
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="div" variant="body1">
                                {name}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                component="div"
                            >
                                {id}
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>
                <Box
                    sx={{
                        textAlign: "center",
                        alignContent: "center",
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        margin: "auto",
                    }}
                >
                    <Typography gutterBottom variant="body1" component="div">
                        {"x" + quantity}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 2,
                        textAlign: "center",
                        alignContent: "center",
                        alignItems: "center",
                        margin: "auto",
                    }}
                >
                    <CardContent>
                        <Typography variant="body1" color="text.primary">
                            {"$" + subtotal}
                        </Typography>
                    </CardContent>
                </Box>
            </Box>
        </Card>
    );
};

export default BuyProductViewComponent;
