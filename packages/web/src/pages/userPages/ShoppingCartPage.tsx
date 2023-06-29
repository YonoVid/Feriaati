import { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { userType } from "@feria-a-ti/common/model/functionsTypes";

import ShoppingCartComponent from "@feria-a-ti/web/src/components/shoppingCartComponent/ShoppingCartComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";

const ShoppingCartPage = () => {
    //Global UI context
    const { products, editProduct, deleteProduct } = useHeaderContext();
    //Global state variable
    const { type } = useContext(UserContext);

    const onEdit = (index: number, quantity: number) => {
        editProduct(index, quantity);
        return true;
    };

    const onDelete = (index: number) => {
        deleteProduct(index);
        return false;
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
                    />
                </Card>
            )}
        </>
    );
};

export default ShoppingCartPage;
