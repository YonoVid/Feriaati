import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
    Environment,
} from "transbank-sdk";

import { checkBuyProduct } from "../../check/checkBuyProduct";
import { messagesCode } from "../../constants/errors";
import { ProductFactureFields } from "../../model/fields/buyingFields";
import { ResponseData } from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";

export const payProductsMobile = async (
    data: {
        formatedData: ProductFactureFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
        returnUrl: string;
    },
    onSuccess: (value: any) => void
) => {
    payProducts(data, onSuccess, false);
};

export const payProductsWeb = async (
    data: {
        formatedData: ProductFactureFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
        returnUrl: string;
    },
    onSuccess: (value: any) => void
) => {
    payProducts(data, onSuccess, true);
};

export const payProducts = async (
    data: {
        formatedData: ProductFactureFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
        returnUrl: string;
    },
    onSuccess: (value: any) => void,
    isWeb: boolean = true
) => {
    const { formatedData, setCanSubmit, setMessage, returnUrl } = data;

    console.log("DATA::", formatedData);
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
                    //setIsLogged(result.data as any);

                    console.log("TRANSBANK TEST::");

                    const amount = formatedData.amount;
                    const sessionId = formatedData.token + "-" + extra;

                    const tx = new WebpayPlus.Transaction(
                        new Options(
                            IntegrationCommerceCodes.WEBPAY_PLUS,
                            IntegrationApiKeys.WEBPAY,
                            isWeb ? "/api" : Environment.Integration
                        )
                    );
                    tx.create(extra, sessionId, amount, returnUrl)
                        .then((response) => {
                            onSuccess && onSuccess(response);
                            return new Promise((resolve, reject) => {
                                resolve(response);
                            });
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
        return new Promise((resolve, reject) => {
            resolve(undefined);
        });
    }
};
