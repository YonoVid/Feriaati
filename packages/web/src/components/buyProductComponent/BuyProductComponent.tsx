import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { BuyProductComponentProps } from "@feria-a-ti/common/model/props/buyProductComponentProps";

import "./BuyProductComponent.css";
import BuyProductViewComponent from "./BuyProductViewComponent";

function BuyProductComponent(props: BuyProductComponentProps) {
    const { canSubmit, finalPrice, factureData, onSubmit, children } = props;

    return (
        <Card
            className="inputContainer"
            sx={{
                maxWidth: "80%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <Stack
                direction={{ xs: "column" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {Object.entries(factureData).map((vendor, index) => (
                    <div key={index}>
                        <Typography
                            sx={{ fontSize: 14 }}
                            color="text.primary"
                            gutterBottom
                        >
                            {index + ":VENDOR: " + vendor[0]}
                        </Typography>
                        {vendor[1].map((product, index) => (
                            <BuyProductViewComponent
                                key={product.id + index}
                                product={product}
                            />
                        ))}
                    </div>
                ))}
            </Stack>
            <Card>
                <CardContent>
                    <Typography
                        sx={{ fontSize: 25 }}
                        color="text.primary"
                        gutterBottom
                    >
                        {"TOTAL: $" + finalPrice}
                    </Typography>
                </CardContent>
            </Card>
            <Box sx={{ margin: "1em" }}>
                <Button
                    color="primary"
                    variant="contained"
                    type="button"
                    disabled={!canSubmit}
                    onClick={onSubmit}
                >
                    Modificar lista
                </Button>
            </Box>
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default BuyProductComponent;
