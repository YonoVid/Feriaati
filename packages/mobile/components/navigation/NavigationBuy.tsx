import React, { useEffect, useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { BottomNavigation } from "react-native-paper";

import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    AccountData,
    ProductFactureData,
    ProductListCollectionData,
    ProductUnit,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { BUYERROR } from "@feria-a-ti/common/model/users/buyTypes";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { ShoppingCartItem } from "@feria-a-ti/common/model/props/shoppingCartProps";
import { checkGetAccountFields } from "@feria-a-ti/common/check/checkAccountFields";

import { messagesCode } from "@feria-a-ti/common/constants/errors";

import { ShoppingCartPage } from "@feria-a-ti/mobile/app/client/ShoppingCartPage";
import BuyProducts from "@feria-a-ti/mobile/app/client/BuyProducts";

import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";
import { formatFacture } from "@feria-a-ti/common/functions/factureFunctions";
import { getAccountData } from "@feria-a-ti/common/functions/accountFunctions";

export interface NavigationBarProps {
    navigation: NavigationProp<ParamListBase>;
}

export default function NavigationBuy(props: NavigationBarProps) {
    // Context variables
    const { authToken, type, products, setMessage } = useAppContext();
    // Stored products list data
    const [productList, setProductList] = useState<Array<ShoppingCartItem>>([]);
    // Stored petition related data
    const [vendorData, setVendorData] = useState<{
        [id: string]: ProductListCollectionData;
    }>({});

    const [productPetition, setProductPetition] = useState<{
        [id: string]: ProductFactureData[];
    }>();
    const [priceTotal, setPriceTotal] = useState<number>(0);
    const [vendorCheck, setVendorCheck] = useState<BUYERROR>(BUYERROR.NONE);

    const [accountData, setAccountData] = useState<AccountData>();

    const [response, setResponse] = useState<{ token: string; url: string }>();

    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        localGetAccountData();

        if (products != null && products != undefined) {
            const { buyError, priceTotal, productPetition, vendorData } =
                formatFacture(products, vendorCheck);

            // Store formated data
            setVendorCheck(buyError);
            console.log("BUY ERROR::", buyError);

            setPriceTotal(priceTotal);
            setProductPetition(productPetition);
            setVendorData(vendorData);
        }
        if (products.size > 0) {
            const newList: Array<ShoppingCartItem> = [];
            products.forEach((vendor, key) => {
                console.log("VENDOR::", key);
                vendor.products.forEach((product) => newList.push(product));
            });
            setProductList(newList);
            console.log(newList);
        } else {
            setProductList([]);
        }
    }, []);

    const localGetAccountData = () => {
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            type: type,
        };

        getAccountData(formatedData, setAccountData, setCanSubmit, setMessage);
    };

    // Navigation tab data
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: "factureBuy",
            title: "Factura",
            focusedIcon: "file-document-multiple",
            unfocusedIcon: "file-document-multiple-outline",
        },
        {
            key: "formBuy",
            title: "Pagar",
            focusedIcon: "account-cash",
            unfocusedIcon: "account-cash-outline",
        },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        factureBuy: () =>
            ShoppingCartPage({
                ...props,
                isEditable: false,
                loadedList: productList,
            }),
        formBuy: () =>
            BuyProducts({
                ...props,
                accountData: accountData,
                vendorCheck: vendorCheck,
                priceTotal: priceTotal,
                productPetition: productPetition,
                response: response,
                setResponse: setResponse,
                canSubmit: true,
                setCanSubmit: setCanSubmit,
            }),
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
        />
    );
}
