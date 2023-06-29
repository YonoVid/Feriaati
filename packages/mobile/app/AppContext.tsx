import React, { createContext, useContext, useState } from "react";
import {
    SessionUserData,
    UIMessages,
} from "@feria-a-ti/common/model/sessionType";

import {
    ProductCollectionData,
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
import { ShoppingCartItem } from "@feria-a-ti/common/model/props/shoppingCartProps";

export type AppContext = SessionUserData &
    UIMessages & {
        products: Array<ShoppingCartItem>;
        addProduct: (data: ProductCollectionData, quantity: number) => void;
        editProduct: (index: number, quantity: number) => void;
        deleteProduct: (index: number) => void;
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
    products: [],
    addProduct: (data: ProductCollectionData) => null,
    editProduct: (index: number, quantity: number) => null,
    deleteProduct: (index: number) => null,
    setMessage: () => false,
});

export const AppContext = (props: { children: any }) => {
    const [user, setUser] = useState<string>();
    const [token, setToken] = useState<string>("");
    const [type, setType] = useState<userType>(userType.undefined);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [shoppingCart, setShoppingCart] = useState<Array<ShoppingCartItem>>(
        []
    );

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
