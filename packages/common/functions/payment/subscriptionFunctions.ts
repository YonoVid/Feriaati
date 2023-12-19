import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { checkGetAccountFields } from "../../check/checkAccountFields";
import { messagesCode } from "../../constants/errors";

import { GetAccountFields } from "../../model/account/getAccountFields";
import { SubscriptionFields } from "../../model/account/subscriptionAccountFields";
import { ResponseData, SubscriptionData } from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";

export const getSubscription = async (
    data: {
        formatedData: GetAccountFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: SubscriptionData) => void
): Promise<any> => {
    const { formatedData, setCanSubmit, setMessage } = data;

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
                extra != null && onSuccess(extra);
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true)); //Unlock register button
    }
};

export const paySubscriptionWeb = async (
    data: {
        formatedData: SubscriptionFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: any) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    console.log("DATA::", formatedData);
    // Generate facture
    if (formatedData && formatedData != null) {
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
                    //setIsLogged(result.data as any);

                    console.log("TRANSBANK TEST::");

                    const amount = formatedData.amount;
                    const sessionId = formatedData.token + "-" + extra;
                    const returnUrl =
                        window.location.origin + "/transaction/subscription";

                    const tx = new WebpayPlus.Transaction(
                        new Options(
                            IntegrationCommerceCodes.WEBPAY_PLUS,
                            IntegrationApiKeys.WEBPAY,
                            "/api" //Environment.Integration
                        )
                    );
                    tx.create(extra, sessionId, amount, returnUrl)
                        .then((newResponse) => {
                            onSuccess(newResponse);
                        })
                        .catch((error) => {
                            console.log(error);
                            setMessage({
                                msg: messagesCode["ERR00"],
                                isError: error,
                            });
                            setCanSubmit(true);
                        })
                        .finally(() => setCanSubmit(true));
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    } else {
        setMessage({ msg: "Datos de pedido incorrectos", isError: true });
    }
};
