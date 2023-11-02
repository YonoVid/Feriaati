import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
    Environment,
} from "transbank-sdk";

import { checkBuyProduct } from "../check/checkBuyProduct";
import { ProductFactureFields } from "../model/fields/buyingFields";
import { ResponseData } from "../model/functionsTypes";
import { MessageData } from "../model/sessionType";

export const callPayment = async (
    petitionData: {
        data: ProductFactureFields;
        priceTotal: number;
        returnUrl: string;
        onResponse?: (value: any) => void;
        setMessage: (value: MessageData) => void;
    },
    isWeb: boolean = false
): Promise<any> => {
    const { data, priceTotal, returnUrl, onResponse, setMessage } =
        petitionData;

    console.log("DATA::", data);
    // Generate facture
    if (checkBuyProduct(data)) {
        const buyProductUser = httpsCallable<
            ProductFactureFields,
            ResponseData<string>
        >(functions, "buyProductUser");
        buyProductUser(data).then((result) => {
            const { msg, error, extra } = result.data;
            console.log(result.data);

            setMessage({ msg, isError: error });
            if (!error) {
                //setIsLogged(result.data as any);

                console.log("TRANSBANK TEST::");

                const amount = priceTotal;
                const sessionId = data.token + "-" + extra;

                const tx = new WebpayPlus.Transaction(
                    new Options(
                        IntegrationCommerceCodes.WEBPAY_PLUS,
                        IntegrationApiKeys.WEBPAY,
                        isWeb ? "/api" : Environment.Integration
                    )
                );
                tx.create(extra, sessionId, amount, returnUrl).then(
                    (response) => {
                        onResponse && onResponse(response);
                        return new Promise((resolve, reject) => {
                            resolve(response);
                        });
                    }
                );
            }
        });
    } else {
        setMessage({ msg: "Datos de pedido incorrectos", isError: true });
        return new Promise((resolve, reject) => {
            resolve(undefined);
        });
    }
};
