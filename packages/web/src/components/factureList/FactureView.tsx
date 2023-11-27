import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";

import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

export type FactureViewProps = {
    color: string;
    facture: FactureData;
    vendorId?: string;
};

export const FactureView = (props: FactureViewProps) => {
    const { color, facture } = props;
    const { id, products } = facture;

    const [finalPrice, setFinalPrice] = useState(0);

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    useEffect(() => {
        if (products.length > 0) {
            let value = 0;
            products.forEach((product) => {
                value += product.subtotal;
            });
            setFinalPrice(value);
        }
    }, [products]);

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
            <Typography component="div" variant="h6">
                {id + "-" + new Date(facture.date.seconds * 1000).toISOString()}
            </Typography>
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
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cantidad</TableCell>
                                <TableCell align="right">Precio</TableCell>
                                <TableCell align="right">Subtotal</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell component="th" scope="row">
                                        {product.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {product.quantity}
                                    </TableCell>
                                    <TableCell align="right">
                                        {"$" +
                                            product.subtotal / product.quantity}
                                    </TableCell>
                                    <TableCell align="right">
                                        {"$" + product.subtotal}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
        </Card>
    );
};

export default FactureView;
