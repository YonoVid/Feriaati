import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useHeaderContext } from "../HeaderLayout";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Box, Button, Card, Hidden } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    AccountData,
    ProductFactureData,
    ProductUnit,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";

import BuyProductComponent from "../../components/buyProductComponent/BuyProductComponent";

import { UserContext } from "@feria-a-ti/web/src/App";
import BuyProductForm from "../../components/forms/buyProductForm/BuyProductForm";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { checkGetAccountFields } from "@feria-a-ti/common/check/checkAccountFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { FourMpRounded } from "@mui/icons-material";

const BuyProductsPage = () => {
    const { handleSubmit } = useForm();
    //Global UI context
    const { products, setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Form variables
    const form: HTMLFormElement | null =
        document.querySelector("#transbankForm") || null;

    const [canSubmit, setCanSubmit] = useState(false);

    const [accountData, setAccountData] = useState<AccountData>();

    const [priceTotal, setPriceTotal] = useState<number>(0);

    const [productPetition, setProductPetition] = useState<{
        [id: string]: ProductFactureData[];
    }>({});

    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        getAccountData();

        let newTotal = 0;
        const newProductPetition: { [id: string]: ProductFactureData[] } = {};

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

            newProductPetition[id.vendorId] = [
                {
                    id: id.productId,
                    name: product.value.name + unitLabel,
                    quantity: quantity,
                    subtotal: finalPrice * quantity,
                },
                ...(newProductPetition[product.id.vendorId] || []),
            ];
            newTotal += finalPrice;
        });
        setPriceTotal(newTotal);
        // Store formated data
        setProductPetition(newProductPetition);
    }, []);

    const getAccountData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            type: type,
        };
        const check = checkGetAccountFields(formatedData);

        console.log("ERROR CHECK::", check);

        if (check) {
            //Lock register button
            setCanSubmit(false);
            //Call firebase function to create user
            const getAccount = httpsCallable<
                GetAccountFields,
                ResponseData<AccountData>
            >(functions, "getAccountUser");
            getAccount(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    setAccountData(extra);
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    const onClick = async () => {
        setCanSubmit(false);
        // Generate facture
        if (productPetition == null) {
            const buyProductUser = httpsCallable<
                ProductFactureFields,
                ResponseData<string>
            >(functions, "buyProductUser");
            buyProductUser({
                token: authToken as string,
                products: productPetition,
            })
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setMessage({ msg, isError: error });
                    if (!error) {
                        resetProduct();
                    }
                    //setIsLogged(result.data as any);
                })
                .finally(() => setCanSubmit(true));
        }

        console.log("TRANSBANK TEST::");

        const amount = priceTotal;
        const buyOrder = "1234567890";
        const sessionId = authToken + "-1234567890";
        const returnUrl = window.location.href;

        const tx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                "/api" //Environment.Integration
            )
        );
        tx.create(buyOrder, sessionId, amount, returnUrl)
            .then((newResponse) => {
                setResponse(newResponse);
                console.log(newResponse);
                console.log(form);
                if (newResponse != null && form != null) {
                    console.log("SUBMIT FORM");

                    form.action = newResponse.url;
                    form.onformdata = (ev) => {
                        ev.formData.set("token_ws", newResponse.token);
                    };
                    form.requestSubmit();
                }
            })
            .finally(() => setCanSubmit(true));
    };

    return (
        <>
            {type !== userType.user && <Navigate to="/login" replace={true} />}
            <Hidden>
                <form
                    id="transbankForm"
                    name="transbankForm"
                    method="post"
                    action={response ? response.url : ""}
                >
                    <input
                        type="hidden"
                        name="token_ws"
                        value={response ? response.token : ""}
                    />
                </form>
            </Hidden>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                }}
            >
                <BuyProductForm
                    account={accountData}
                    canSubmit={true}
                    onSubmit={() => setCanSubmit(true)}
                />
                <BuyProductComponent
                    finalPrice={priceTotal}
                    factureData={productPetition}
                    canSubmit={canSubmit}
                    onSubmit={onClick}
                />
            </Box>
        </>
    );
};

export default BuyProductsPage;
