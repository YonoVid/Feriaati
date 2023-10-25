import { useContext, useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { AlertColor, Grid } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";

import NavBar from "@feria-a-ti/web/src/components/navBar/NavBar";
import {
    ProductId,
    ShoppingCartItem,
} from "@feria-a-ti/common/model/props/shoppingCartProps";
import { UserContext } from "../App";
import { ProductListCollectionData } from "@feria-a-ti/common/model/functionsTypes";

import { getFromLocal, saveToLocal } from "@feria-a-ti/common/helpers";

export type HeaderLayoutContext = {
    setMessage: (data: { msg: string; isError: boolean }) => void;
    products: Map<
        string,
        {
            vendor: ProductListCollectionData;
            products: Map<string, ShoppingCartItem>;
        }
    >;
    addProduct: (
        data: ShoppingCartItem,
        vendor: ProductListCollectionData
    ) => void;
    editProduct: (id: ProductId, quantity: number) => void;
    deleteProduct: (id: ProductId) => void;
    resetProduct: () => void;
};

export interface SnackbarMessage {
    msg: string;
    key: number;
    type: AlertColor;
}

export const HeaderLayout = () => {
    // Storage keys
    const shoppingKey = "shoppingCart";
    // Context variables
    const { productQuantity, setProductQuantity } = useContext(UserContext);

    // Message variables
    const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
    const [open, setOpen] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState<SnackbarMessage | undefined>(
        undefined
    );
    const [shoppingCart, setShoppingCart] = useState<
        Map<
            string,
            {
                vendor: ProductListCollectionData;
                products: Map<string, ShoppingCartItem>;
            }
        >
    >(getFromLocal(shoppingKey) || new Map());

    // // Alert Related values
    // const [showAlert, setShowAlert] = useState(false);
    // const [alertMessage, setAlertMessage] = useState("TEXT");

    const setMessage = (data: { msg: string; isError: boolean }) => {
        setSnackPack((prev) => [
            ...prev,
            {
                msg: data.msg,
                type: data.isError ? "error" : "success",
                key: new Date().getTime(),
            },
        ]);

        setOpen(true);
    };

    const handleExited = () => {
        setSnackBarMsg(undefined);
    };

    const addProduct = (
        data: ShoppingCartItem,
        vendor: ProductListCollectionData
    ) => {
        let productMap = shoppingCart.get(data.id.vendorId)?.products;
        let checkIndex = false;
        if (productMap && productMap != null) {
            checkIndex = productMap.has(data.id.productId);
        } else {
            productMap = new Map();
        }

        console.log("PRODUCT ID::", data.id);
        console.log("PRODUCT LIST INDEX::", checkIndex);
        console.log("PRODUCT LIST KEYS::", shoppingCart.keys);

        if (checkIndex) {
            const oldData = productMap.get(data.id.productId);
            const oldQuantity = oldData ? oldData.quantity : 0;
            editProduct(data.id, oldQuantity + data.quantity);
        } else {
            const newShoppingCart = new Map(shoppingCart);
            newShoppingCart.set(data.id.vendorId, {
                vendor: vendor,
                products: productMap.set(data.id.productId, data),
            });

            setShoppingCart(newShoppingCart);
            setProductQuantity(productQuantity + 1);
            setMessage({
                msg: "Añadido producto al carro",
                isError: false,
            });
            //Store persistent local data
            saveToLocal(shoppingKey, newShoppingCart);
        }
    };

    const editProduct = (id: ProductId, quantity: number) => {
        const { vendorId, productId } = id;
        const productArray = shoppingCart.get(vendorId);
        const vendor: ProductListCollectionData | undefined =
            productArray?.vendor;
        const products: Map<string, ShoppingCartItem> | undefined =
            productArray?.products;

        if (vendor != null && vendor != undefined && products?.has(productId)) {
            const product = products?.get(productId);
            const newShoppingCart = new Map(shoppingCart);

            newShoppingCart.set(vendorId, {
                vendor: vendor,
                products: products.set(productId, {
                    id: product!.id,
                    value: product!.value,
                    quantity: quantity,
                }),
            });

            setShoppingCart(newShoppingCart);
            setMessage({ msg: "Editado producto del carro", isError: false });
            //Store persistent local data
            saveToLocal(shoppingKey, newShoppingCart);
        }
    };

    const deleteProduct = (id: ProductId) => {
        const { vendorId, productId } = id;
        const vendor = shoppingCart.get(vendorId);
        const product = vendor?.products?.get(productId);

        if (
            vendor != null &&
            vendor != undefined &&
            product != undefined &&
            product != null
        ) {
            const newShoppingCart = new Map(shoppingCart);
            if (vendor.products!.size < 2) {
                console.log("DELETED VENDOR ENTRY");
                newShoppingCart.delete(vendorId);
            } else {
                newShoppingCart.get(vendorId)?.products.delete(productId);
            }

            setShoppingCart(newShoppingCart);

            setProductQuantity(productQuantity - 1);
            setMessage({ msg: "Eliminado producto del carro", isError: false });
            //Store persisten local data
            saveToLocal(shoppingKey, newShoppingCart);
        }
    };

    const resetProduct = () => {
        setShoppingCart(new Map());
        setProductQuantity(0);
        setMessage({ msg: "Reiniciado carro", isError: false });
        //Store persisten local data
        localStorage.removeItem(shoppingKey);
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

    useEffect(() => {
        if (shoppingCart.size > 0) {
            let quantity = 0;
            shoppingCart.forEach((value) => {
                quantity += value.products.size;
            });
            setProductQuantity(quantity);
        }
        if (snackPack.length && !snackBarMsg) {
            // Set a new snack when we don't have an active one
            setSnackBarMsg({ ...snackPack[0] });
            setSnackPack((prev) => prev.slice(1));
            setOpen(true);
        } else if (snackPack.length && snackBarMsg && open) {
            // Close an active snack when a new one is added
            setOpen(false);
        }
    }, [snackPack, snackBarMsg, open, shoppingCart, setProductQuantity]);

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
                            resetProduct,
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
            <Snackbar
                key={snackBarMsg ? snackBarMsg.key : undefined}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                TransitionProps={{ onExited: handleExited }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackBarMsg?.type || undefined}
                    sx={{ width: "100%" }}
                >
                    {snackBarMsg ? snackBarMsg?.msg : undefined}
                </Alert>
            </Snackbar>
        </>
    );
};

export const useHeaderContext = () => useOutletContext<HeaderLayoutContext>();
