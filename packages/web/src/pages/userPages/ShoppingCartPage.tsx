import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { userType } from "@feria-a-ti/common/model/functionsTypes";

import ShoppingCartComponent from "@feria-a-ti/web/src/components/shoppingCartComponent/ShoppingCartComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import {
    ProductId,
    ShoppingCartItem,
} from "@feria-a-ti/common/model/props/shoppingCartProps";

const ShoppingCartPage = () => {
    //Global UI context
    const { products, setMessage, editProduct, deleteProduct, resetProduct } =
        useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();

    const [productList, setProductList] = useState<Array<ShoppingCartItem>>([]);

    const [canSubmit, setCanSubmit] = useState(true);

    const onEdit = (id: ProductId, quantity: number) => {
        editProduct(id, quantity);
        return true;
    };

    const onDelete = (id: ProductId) => {
        deleteProduct(id);
        return false;
    };

    const onSubmit = () => {
        setCanSubmit(false);
        if (products.size > 0) {
            navigate("/buyProducts");
        }
    };

    useEffect(() => {
        console.log("IS CART EMPTY?::", Object.keys(products).length > 0);
        console.log(products);
        if (products.size > 0) {
            const newList: Array<ShoppingCartItem> = [];
            products.forEach((vendor, key) => {
                console.log("VENDOR::", key);
                vendor.products.forEach((product) => newList.push(product));
            });
            setProductList(newList);
            console.log(newList);
        }
    }, [products]);

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
                        products={productList || []}
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
