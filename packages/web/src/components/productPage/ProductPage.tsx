import { Box, Button, Card } from "@mui/material";

import { ProductVendorPageProps } from "@feria-a-ti/common/model/productVendorPageProps";

import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import "./ProductPage.css";
import "../../App.css";

function ProductVendorPage(props: ProductVendorPageProps) {
    const { vendorData, products, onAdd, onEdit, onDelete, onUpdatePage } =
        props;
    const { enterpriseName, street, streetNumber, image } = vendorData;
    return (
        <>
            <Card
                className="inputContainer"
                color="primary"
                sx={{
                    maxWidth: "80%",
                    alignContent: "center",
                    borderRadius: "2%",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box sx={{ flex: 1 }}>
                        <h1 style={{ maxWidth: "100%" }}>
                            {enterpriseName != null
                                ? enterpriseName
                                : "Productos vendedor"}
                        </h1>

                        <h3>
                            Dirección de local:{street} {streetNumber}
                        </h3>
                        <h3>
                            Zona de atención:{street} {streetNumber}
                        </h3>
                        <h5>
                            Horario de atención:{street} {streetNumber}
                        </h5>
                        <h5>
                            Método de contacto:{street} {streetNumber}
                        </h5>
                        <Button onClick={onUpdatePage} variant="contained">
                            Actualizar información
                        </Button>
                    </Box>
                    <Box
                        sx={{ flex: 1, padding: "5%", alignContent: "center" }}
                    >
                        <img
                            style={{
                                maxWidth: "80%",
                                maxHeight: "100%",
                                height: "100%",
                                objectFit: "cover",
                                overflow: "hidden",
                            }}
                            loading="lazy"
                            src={image}
                        ></img>
                    </Box>
                </Box>
            </Card>
            <ProductList
                isEditable={true}
                label=""
                products={products}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </>
    );
}
export default ProductVendorPage;
