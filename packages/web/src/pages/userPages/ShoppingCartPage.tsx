import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { userType } from "@feria-a-ti/common/model/functionsTypes";

import ShoppingCartComponent from "@feria-a-ti/web/src/components/shoppingCartComponent/ShoppingCartComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";

const ShoppingCartPage = () => {
    //Global UI context
    const { products, setMessage, editProduct, deleteProduct, resetProduct } =
        useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();

    const [canSubmit, setCanSubmit] = useState(true);

    const onEdit = (index: number, quantity: number) => {
        editProduct(index, quantity);
        return true;
    };

    const onDelete = (index: number) => {
        deleteProduct(index);
        return false;
    };

    const onSubmit = () => {
        setCanSubmit(false);
        if (products.length > 0) {
            navigate("/buyProducts");
        }
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
                        canSubmit={canSubmit}
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
