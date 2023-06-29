import { useContext, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { AlertColor, Grid } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";

import { ProductCollectionData } from "@feria-a-ti/common/model/functionsTypes";

import NavBar from "@feria-a-ti/web/src/components/navBar/NavBar";
import { ShoppingCartItem } from "@feria-a-ti/common/model/props/shoppingCartProps";
import { UserContext } from "../App";

export type HeaderLayoutContext = {
    setMessage: (data: { msg: string; isError: boolean }) => void;
    products: Array<ShoppingCartItem>;
    addProduct: (data: ProductCollectionData, quantity: number) => void;
    editProduct: (index: number, quantity: number) => void;
    deleteProduct: (index: number) => void;
};

export const HeaderLayout = () => {
    //Context variables
    const { productQuantity, setProductQuantity } = useContext(UserContext);

    const [open, setOpen] = useState(false);
    const [snackBarData, setSnackBarData] = useState("");
    const [snackBarType, setSnackBarType] = useState<AlertColor>("success");
    const [shoppingCart, setShoppingCart] = useState<Array<ShoppingCartItem>>(
        []
    );

    // // Alert Related values
    // const [showAlert, setShowAlert] = useState(false);
    // const [alertMessage, setAlertMessage] = useState("TEXT");

    const setMessage = (data: { msg: string; isError: boolean }) => {
        setSnackBarData(data.msg);
        setSnackBarType(data.isError ? "error" : "success");
        setOpen(true);
    };

    const addProduct = (data: ProductCollectionData, quantity: number) => {
        const checkIndex = shoppingCart.findIndex(
            (item) => item.value === data
        );
        if (checkIndex >= 0) {
            editProduct(
                checkIndex,
                shoppingCart[checkIndex].quantity + quantity
            );
        } else {
            const newShoppingCart = shoppingCart.concat({
                value: data,
                quantity: quantity,
            });

            setShoppingCart(newShoppingCart);
            setProductQuantity(productQuantity + 1);
            setMessage({ msg: "Añadido producto al carro", isError: false });
        }
    };

    const editProduct = (index: number, quantity: number) => {
        const product: ShoppingCartItem | undefined = shoppingCart.at(index);

        if (product != undefined && product != null) {
            const newShoppingCart = shoppingCart.concat([]);
            const newProduct: ShoppingCartItem = {
                value: product.value,
                quantity: quantity,
            };
            newShoppingCart[index] = newProduct;

            setShoppingCart(newShoppingCart);
            setMessage({ msg: "Editado producto del carro", isError: false });
        }
    };

    const deleteProduct = (index: number) => {
        const product: ShoppingCartItem | undefined = shoppingCart.at(index);

        if (product != undefined && product != null) {
            const newShoppingCart = shoppingCart.filter(
                (value, valueIndex) => valueIndex !== index
            );

            setShoppingCart(newShoppingCart);
            setProductQuantity(productQuantity - 1);
            setMessage({ msg: "Eliminado producto del carro", isError: false });
        }
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <header>
                <NavBar />
            </header>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: "90vh" }}
            >
                <Grid
                    item
                    xs={12}
                    sx={{ minWidth: "100%", flex: "1", padding: "1em" }}
                >
                    <Outlet
                        context={{
                            setMessage,
                            products: shoppingCart,
                            addProduct,
                            editProduct,
                            deleteProduct,
                        }}
                    />
                </Grid>
            </Grid>
            {/* <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            /> */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={snackBarType || undefined}
                    sx={{ width: "100%" }}
                >
                    {snackBarData}
                </Alert>
            </Snackbar>
        </>
    );
};

export const useHeaderContext = () => useOutletContext<HeaderLayoutContext>();
