import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import { useHeaderContext } from "../HeaderFunction";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Alert, Box, Hidden } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    AccountData,
    ProductFactureData,
    ProductListCollectionData,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { BUYERROR } from "@feria-a-ti/common/model/users/buyTypes";

import { getAccountData } from "@feria-a-ti/common/functions/accountFunctions";
import { formatFacture } from "@feria-a-ti/common/functions/factureFunctions";

import { checkBuyProduct } from "@feria-a-ti/common/check/checkBuyProduct";

import BuyProductComponent from "@feria-a-ti/web/src/components/buyProductComponent/BuyProductComponent";
import BuyProductForm from "@feria-a-ti/web/src/components/forms/buyProductForm/BuyProductForm";

import { UserContext } from "@feria-a-ti/web/src/App";

const BuyProductsPage = () => {
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
    const [vendorCheck, setVendorCheck] = useState<BUYERROR>(BUYERROR.NONE);

    const [accountData, setAccountData] = useState<AccountData>();

    const [priceTotal, setPriceTotal] = useState<number>(0);

    const [vendorData, setVendorData] = useState<{
        [id: string]: ProductListCollectionData;
    }>({});

    const [productPetition, setProductPetition] = useState<{
        [id: string]: ProductFactureData[];
    }>();

    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        localGetAccountData();

        if (products != null && products != undefined) {
            const { buyError, priceTotal, productPetition, vendorData } =
                formatFacture(products, vendorCheck);

            setVendorCheck(buyError);
            console.log("BUY ERROR::", buyError);
            setPriceTotal(priceTotal);
            // Store formated data
            setProductPetition(productPetition);
            setVendorData(vendorData);
        }
    }, []);

    const localGetAccountData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            type: type,
        };

        getAccountData(formatedData, setAccountData, setCanSubmit, setMessage);
    };

    const onClick = (data: FieldValues) => {
        const formatedData: ProductFactureFields = {
            direction: data.direction || undefined,
            token: authToken as string,
            products: productPetition || {},
        };
        console.log("DATA::", data);
        // Generate facture
        if (checkBuyProduct(formatedData)) {
            setCanSubmit(false);
            const buyProductUser = httpsCallable<
                ProductFactureFields,
                ResponseData<string>
            >(functions, "buyProductUser");
            buyProductUser(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setMessage({ msg, isError: error });
                    if (!error) {
                        resetProduct();
                        //setIsLogged(result.data as any);

                        console.log("TRANSBANK TEST::");

                        const amount = priceTotal;
                        const sessionId = authToken + "-" + extra;
                        const returnUrl =
                            window.location.origin + "/transaction/products";

                        const tx = new WebpayPlus.Transaction(
                            new Options(
                                IntegrationCommerceCodes.WEBPAY_PLUS,
                                IntegrationApiKeys.WEBPAY,
                                "/api" //Environment.Integration
                            )
                        );
                        tx.create(extra, sessionId, amount, returnUrl)
                            .then((newResponse) => {
                                setResponse(newResponse);
                                console.log(newResponse);
                                console.log(form);
                                if (newResponse != null && form != null) {
                                    console.log("SUBMIT FORM");

                                    form.action = newResponse.url;
                                    form.onformdata = (ev) => {
                                        ev.formData.set(
                                            "token_ws",
                                            newResponse.token
                                        );
                                    };
                                    form.requestSubmit();
                                }
                            })
                            .finally(() => setCanSubmit(true));
                    }
                })
                .finally(() => setCanSubmit(true));
        } else {
            setMessage({ msg: "Datos de pedido incorrectos", isError: true });
        }
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                {(vendorCheck == BUYERROR.REGION && (
                    <Alert severity="error" sx={{ margin: 1 }}>
                        Los productos son entregados por vendedores en regiones
                        distintas
                    </Alert>
                )) ||
                    (vendorCheck == BUYERROR.COMMUNE && (
                        <Alert severity="warning" sx={{ margin: 1 }}>
                            Los productos son entregados por vendedores en
                            comunas distintas
                        </Alert>
                    ))}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <BuyProductComponent
                        finalPrice={priceTotal}
                        factureData={productPetition || {}}
                        vendorData={vendorData}
                        canSubmit={canSubmit}
                        onSubmit={() => navigate("/shoppingCart")}
                    />
                    <BuyProductForm
                        account={accountData}
                        canSubmit={
                            canSubmit &&
                            vendorCheck == BUYERROR.NONE &&
                            priceTotal != 0
                        }
                        onSubmit={(data) => {
                            console.log(data);
                            onClick(data);
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};

export default BuyProductsPage;
