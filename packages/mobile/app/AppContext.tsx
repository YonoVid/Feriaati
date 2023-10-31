import React, { createContext, useContext, useState } from "react";
import {
    SessionUserData,
    UIMessages,
} from "@feria-a-ti/common/model/sessionType";

import {
    ProductCollectionData,
    ProductListCollectionData,
    UserToken,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    getSessionEmail,
    getSessionToken,
    getSessionType,
    setSession,
    resetSession,
    getSession,
} from "../utilities/sessionData";
import { MessageAlert } from "../components/MessageAlert";
import {
    ProductId,
    ShoppingCartItem,
} from "@feria-a-ti/common/model/props/shoppingCartProps";

export type AppContext = SessionUserData &
    UIMessages & {
        products: Map<
            string,
            {
                vendor: ProductListCollectionData;
                products: Map<string, ShoppingCartItem>;
            }
        >;
        resetProduct: () => void;
        addProduct: (
            data: ShoppingCartItem,
            vendor: ProductListCollectionData
        ) => void;
        editProduct: (id: ProductId, quantity: number) => void;
        deleteProduct: (id: ProductId) => void;
    };

export const ComponentContext = createContext<AppContext>({
    authUser: "",
    authToken: "",
    type: userType.undefined,
    setSession: (data: UserToken) => {
        data;
    },
    resetSession: () => false,
    checkSession: () => false,
    products: new Map(),
    resetProduct: () => null,
    addProduct: (data: ShoppingCartItem, vendor: ProductListCollectionData) =>
        null,
    editProduct: (id: ProductId, quantity: number) => null,
    deleteProduct: (id: ProductId) => null,
    setMessage: () => false,
});

export const AppContext = (props: { children: any }) => {
    const [user, setUser] = useState<string>();
    const [token, setToken] = useState<string>("");
    const [type, setType] = useState<userType>(userType.undefined);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [shoppingCart, setShoppingCart] = useState<
        Map<
            string,
            {
                vendor: ProductListCollectionData;
                products: Map<string, ShoppingCartItem>;
            }
        >
    >(new Map());

    //Session related variables
    getSession().then((value) => {
        setUser(value.email);
        setToken(value.token);
        setType(value.type);
    });

    const setSessionData = (user: UserToken) => {
        setUser(user.email);
        setToken(user.token);
        setType(user.type);
        setSession(user);
    };

    const resetSessionData = () => {
        setUser("");
        setToken("");
        setType(userType.undefined);
        resetSession();
    };

    const checkSessionData = (): boolean => {
        if (user === "" || token === "" || type === userType.undefined) {
            resetSessionData();
            return false;
        }
        return true;
    };
    //Shopping cart related variables
    const resetProduct = () => {
        setShoppingCart(new Map());
        setProductQuantity(0);
        setMessage({ msg: "Reiniciado carro", isError: false });
        //Store persisten local data
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
        }
    };

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("ERROR");
    const closeAlert = () => {
        setShowAlert(false);
    };

    const setMessage = (data: { msg: string; isError: boolean }) => {
        setAlertMessage(data.msg);
        // setSnackBarType(data.isError ? "error" : "success");
        setShowAlert(true);
    };

    return (
        <>
            <ComponentContext.Provider
                value={{
                    authUser: user,
                    authToken: token,
                    type,
                    products: shoppingCart,
                    resetProduct: resetProduct,
                    addProduct: addProduct,
                    editProduct: editProduct,
                    deleteProduct: deleteProduct,
                    setSession: setSessionData,
                    resetSession: resetSessionData,
                    checkSession: checkSessionData,
                    setMessage: setMessage,
                }}
            >
                {props.children}
            </ComponentContext.Provider>
            <MessageAlert
                open={showAlert}
                title={"ESTADO DE ACCIÓN"}
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
};

export const useAppContext = () => useContext<AppContext>(ComponentContext);
