import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";

import { useHeaderContext } from "../HeaderLayout";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Button, Card, CardActions, Hidden } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    AccountData,
    ResponseData,
    SubscriptionData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductSubscriptionFields } from "@feria-a-ti/common/model/fields/buyingFields";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { checkGetAccountFields } from "@feria-a-ti/common/check/checkAccountFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";

import { UserContext } from "@feria-a-ti/web/src/App";
import SubscriptionForm from "../../components/forms/subscriptionForm/SubscriptionForm";
import { SubscriptionFields } from "@feria-a-ti/common/model/account/subscriptionAccountFields";

const SubscriptionPage = () => {
    //Global UI context
    const { setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Form variables
    const form: HTMLFormElement | null =
        document.querySelector("#transbankForm") || null;

    const [canSubmit, setCanSubmit] = useState(false);

    const [subscriptionData, setSubscriptionData] =
        useState<SubscriptionData>();

    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        getSubscriptionData();
    }, []);

    const getSubscriptionData = () => {
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
                ResponseData<SubscriptionData>
            >(functions, "getAccountSubscription");
            getAccount(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    setSubscriptionData(extra);
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    const onClick = (data: FieldValues) => {
        const formatedData: SubscriptionFields = {
            type: type,
            token: authToken as string,
            amount: data.amount,
            months: data.months,
        };
        console.log("DATA::", formatedData);
        // Generate facture
        if (canSubmit && subscriptionData && subscriptionData != null) {
            setCanSubmit(false);
            const buyProductUser = httpsCallable<
                SubscriptionFields,
                ResponseData<string>
            >(functions, "setAccountSubscription");
            buyProductUser(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setMessage({ msg, isError: error });
                    if (!error) {
                        resetProduct();
                        //setIsLogged(result.data as any);

                        console.log("TRANSBANK TEST::");

                        const amount = formatedData.amount;
                        const sessionId = authToken + "-" + extra;
                        const returnUrl =
                            window.location.origin +
                            "/transaction/subscription";

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
            {!(type === userType.user || type === userType.vendor) && (
                <Navigate to="/login" replace={true} />
            )}
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
            <SubscriptionForm
                canSubmit={canSubmit}
                subscription={subscriptionData}
                onSubmit={onClick}
            />
        </>
    );
};

export default SubscriptionPage;
