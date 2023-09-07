import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    ProductFactureData,
    ProductUnit,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";

import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";

import ShoppingCartComponent from "@feria-a-ti/web/src/components/shoppingCartComponent/ShoppingCartComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";

const ShoppingCartPage = () => {
    //Global UI context
    const { products, setMessage, editProduct, deleteProduct, resetProduct } =
        useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    const onEdit = (index: number, quantity: number) => {
        editProduct(index, quantity);
        return true;
    };

    const onDelete = (index: number) => {
        deleteProduct(index);
        return false;
    };

    const onSubmit = () => {
        const productPetition: { [id: string]: ProductFactureData[] } = {};

        console.log("SUBMIT BUYING PETITION");
        console.log(products);
        products.forEach((product) => {
            const { id, value, quantity } = product;

            const finalPrice =
                value.price -
                (value.discount !== "none"
                    ? value.discount === "percentage"
                        ? (value.price * value.promotion) / 100
                        : value.promotion
                    : 0);
            const unitLabel =
                "(" +
                (value.unitType === ProductUnit.GRAM
                    ? value.unit + "gr."
                    : value.unitType === ProductUnit.KILOGRAM
                    ? "kg."
                    : "unidad") +
                ")";

            productPetition[id.vendorId] = [
                {
                    id: id.productId,
                    name: product.value.name + unitLabel,
                    quantity: quantity,
                    subtotal: finalPrice * quantity,
                },
                ...(productPetition[product.id.vendorId] || []),
            ];
        });
        console.log(productPetition);

        const buyProductUser = httpsCallable<
            ProductFactureFields,
            ResponseData<string>
        >(functions, "buyProductUser");
        buyProductUser({
            token: authToken as string,
            products: productPetition,
        }).then((result) => {
            const { msg, error, extra } = result.data;
            console.log(result.data);

            setMessage({ msg, isError: error });
            if (!error) {
                resetProduct();
            }
            //setIsLogged(result.data as any);
        });
    };

    return (
        <>
            {type !== userType.user && <Navigate to="/login" replace={true} />}
            {products && (
                <Card
                    className="inputContainer"
                    color="secondary"
                    sx={{
                        maxWidth: "80%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                >
                    <h1 style={{ maxWidth: "100%" }}>
                        {"Lista de productos del carro"}
                    </h1>
                    <ShoppingCartComponent
                        label={"Carro de compra"}
                        products={products}
                        isEditable={true}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onSubmit={onSubmit}
                    />
                </Card>
            )}
        </>
    );
};

export default ShoppingCartPage;
