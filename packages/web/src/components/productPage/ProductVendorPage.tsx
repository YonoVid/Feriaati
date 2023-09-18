import { Box, Button, Card } from "@mui/material";

import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { ProductVendorPageProps } from "@feria-a-ti/common/model/props/productVendorPageProps";

import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import "./ProductVendorPage.css";
import "../../App.css";
import { colors } from "@feria-a-ti/common/theme/base";

function ProductVendorPage(props: ProductVendorPageProps) {
    const {
        vendorId,
        vendorData,
        products,
        isEditable,
        addProduct,
        onAdd,
        onEdit,
        onDelete,
        onUpdatePage,
    } = props;
    const {
        rating,
        enterpriseName,
        street,
        streetNumber,
        commune,
        region,
        serviceTime,
        contact,
        image,
    } = vendorData;

    const rateCount =
        rating && rating != null ? rating.positive + rating.negative : 1;

    const rate =
        rating && rating != null
            ? rating.positive - rating.negative / rateCount
            : 0;

    const rateColor =
        Math.abs(rate) < 0.1
            ? "none"
            : rate > 0
            ? colors.primary
            : colors.secondary;

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
                            Zona de atención:
                            {(region ? regionCode[region - 1][1] : "") +
                                ", " +
                                (region && commune
                                    ? regionCommune[region].find(
                                          (el: string | number[]) =>
                                              el[0] === commune
                                      )[1]
                                    : "")}
                        </h3>
                        <h5>
                            Horario de atención:
                            {serviceTime &&
                                (serviceTime?.start.hours
                                    .toString()
                                    .padStart(2, "0") +
                                    ":" +
                                    serviceTime?.start.minutes
                                        .toString()
                                        .padStart(2, "0") || "") +
                                    "-" +
                                    (serviceTime?.end.hours
                                        .toString()
                                        .padStart(2, "0") +
                                        ":" +
                                        serviceTime?.end.minutes
                                            .toString()
                                            .padStart(2, "0") || "")}
                        </h5>
                        <h5>
                            Método de contacto:
                            {(contact &&
                                contact?.phone + "-" + contact?.email) ||
                                "-"}
                        </h5>
                        {isEditable && (
                            <Button onClick={onUpdatePage} variant="contained">
                                Actualizar información
                            </Button>
                        )}
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
                <Box
                    sx={{
                        backgroundColor: rateColor,
                        color: colors.light,
                    }}
                >
                    {Math.abs(rate) < 0.1 ? (
                        <h3>Valoración: No hay suficiente información</h3>
                    ) : (
                        <h3>
                            Valoración:{" "}
                            {(rate > 0 ? "Positiva" : "Negativa") +
                                "(" +
                                rateCount +
                                ")"}
                        </h3>
                    )}
                </Box>
            </Card>
            <ProductList
                isEditable={isEditable}
                label=""
                products={products}
                vendorId={vendorId || "empty"}
                addProduct={addProduct}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </>
    );
}
export default ProductVendorPage;
