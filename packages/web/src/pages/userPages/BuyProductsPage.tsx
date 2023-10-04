import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useHeaderContext } from "../HeaderLayout";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Button, Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    ProductFactureData,
    ProductUnit,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";

import BuyProductComponent from "../../components/buyProductComponent/BuyProductComponent";

import { UserContext } from "@feria-a-ti/web/src/App";

const BuyProductsPage = () => {
    //Global UI context
    const { products, setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Form variables
    const [canSubmit, setCanSubmit] = useState(true);

    const [priceTotal, setPriceTotal] = useState<number>(0);

    const [productPetition, setProductPetition] = useState<{
        [id: string]: ProductFactureData[];
    }>({});

    const [response, setResponse] = useState<any>();

    useEffect(() => {
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

        const amount = 1000;
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
            })
            .finally(() => setCanSubmit(true));
    };

    return (
        <>
            {type !== userType.user && <Navigate to="/login" replace={true} />}
            {response != undefined && response != null && (
                <form method="post" action={response.url}>
                    <input
                        type="hidden"
                        name="token_ws"
                        value={response.token}
                    />
                    <input type="submit" value="Ir a pagar" />
                </form>
            )}

            <BuyProductComponent
                finalPrice={priceTotal}
                factureData={productPetition}
                canSubmit={canSubmit}
                onSubmit={onClick}
            />

            <Button onClick={() => setCanSubmit(!canSubmit)}>
                BUTTON SWITCH
            </Button>
        </>
    );
};

export default BuyProductsPage;
