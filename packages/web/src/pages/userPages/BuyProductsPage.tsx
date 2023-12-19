import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import LoadingOverlay from "react-loading-overlay-ts";

import { Alert, Box, Hidden } from "@mui/material";

import {
    AccountData,
    ProductFactureData,
    ProductListCollectionData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductFactureFields } from "@feria-a-ti/common/model/fields/buyingFields";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { BUYERROR } from "@feria-a-ti/common/model/users/buyTypes";

import { getAccountUser } from "@feria-a-ti/common/functions/account/accountFunctions";
import { formatFacture } from "@feria-a-ti/common/functions/factureFunctions";
import { payProductsWeb } from "@feria-a-ti/common/functions/payment/paymentFunctions";

import BuyProductComponent from "@feria-a-ti/web/src/components/buyProductComponent/BuyProductComponent";
import BuyProductForm from "@feria-a-ti/web/src/components/forms/buyProductForm/BuyProductForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";

const BuyProductsPage = () => {
    //Global UI context
    const { products, setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);
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
        localGetAccountUser();

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

    const localGetAccountUser = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            email: emailUser as string,
            token: authToken as string,
            type: type,
        };

        getAccountUser(
            { formatedData, setCanSubmit, setMessage },
            setAccountData
        );
    };

    const onClick = (data: FieldValues) => {
        const formatedData: ProductFactureFields = {
            direction: data.direction || undefined,
            token: authToken as string,
            products: productPetition || {},
            amount: priceTotal,
        };

        const returnUrl: string =
            window.location.origin + "/transaction/products";

        payProductsWeb(
            { formatedData, setCanSubmit, setMessage, returnUrl },
            (value: any) => {
                setResponse(value);
                console.log(value);
                console.log(form);
                if (value != null && form != null) {
                    console.log("SUBMIT FORM");

                    form.action = value.url;
                    form.onformdata = (ev) => {
                        ev.formData.set("token_ws", value.token);
                    };
                    form.requestSubmit();
                }
            }
        );
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
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Cargando datos..."
            >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {(vendorCheck == BUYERROR.REGION && (
                        <Alert severity="error" sx={{ margin: 1 }}>
                            Los productos son entregados por vendedores en
                            regiones distintas
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
            </LoadingOverlay>
        </>
    );
};

export default BuyProductsPage;
