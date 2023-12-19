import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
    Environment,
} from "transbank-sdk";

import { messagesCode } from "../constants/errors";
import { TransbankTransaction } from "../model/account/paymenTypes";
import {
    FactureTypes,
    UpdateFactureFields,
} from "../model/fields/buyingFields";

import { FactureFields } from "../model/fields/factureFields";
import {
    FactureData,
    FactureStatus,
    ProductFactureData,
    ProductListCollectionData,
    ProductUnit,
    ResponseData,
    userType,
} from "../model/functionsTypes";
import { ShoppingCartItem } from "../model/props/shoppingCartProps";
import { MessageData } from "../model/sessionType";
import { BUYERROR } from "../model/users/buyTypes";

export const getFactures = (
    data: {
        formatedData: FactureFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: Array<FactureData>) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;
    setCanSubmit(false);

    if (formatedData.token != undefined || formatedData.token != "") {
        const getFactures = httpsCallable(functions, "getFactures");
        getFactures(formatedData)
            .then((result) => {
                const { msg, error, extra } = result.data as ResponseData<
                    Array<FactureData>
                >;
                console.log(result);
                //setIsLogged(result.data as any);
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess && onSuccess(extra);
                }
            })
            .catch(() => {
                setMessage({ msg: messagesCode["ERR00"], isError: true });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export type FactureStatusFields = {
    token: string;
    type: userType;
    transactionToken: string;
    factureType: string;
};

export const getFactureStatus = (
    data: {
        formatedData: FactureStatusFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: TransbankTransaction) => void,
    isWeb: boolean = true
) => {
    const {
        formatedData: { token, type, transactionToken, factureType },
        setCanSubmit,
        setMessage,
    } = data;
    if (
        transactionToken &&
        transactionToken != "" &&
        Object.values<string>(FactureTypes).includes(factureType as string)
    ) {
        const tx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                isWeb ? "/api" : Environment.Integration
            )
        );
        tx.commit(transactionToken)
            .then((value: TransbankTransaction) => {
                console.log("TOKEN RESPONSE::", value);

                if (value != undefined && value != null) {
                    onSuccess && onSuccess(value);
                    let status = FactureStatus.NEGATED;
                    if (value.response_code == 0) {
                        status = FactureStatus.APPROVED;
                    }

                    const updateFacture = httpsCallable<
                        UpdateFactureFields,
                        ResponseData<string>
                    >(functions, "updateUserFacture");

                    const formatedData: UpdateFactureFields = {
                        token: token as string,
                        userType: type,
                        facture: value.buy_order,
                        status: status,
                        type: factureType as FactureTypes,
                    };

                    console.log(formatedData);

                    updateFacture(formatedData)
                        .then((result) => {
                            const { msg, error } = result.data;
                            console.log(result);
                            //Show alert message
                            setMessage({ msg, isError: error });
                        })
                        .catch((error) => {
                            console.log(error);
                            setMessage({
                                msg: messagesCode["ERR00"],
                                isError: error,
                            });
                        });
                }
            })
            .catch(() => {
                setMessage({ msg: messagesCode["ERR00"], isError: true });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export type FormatFactureData = {
    buyError: BUYERROR;
    priceTotal: number;
    productPetition: { [id: string]: ProductFactureData[] };
    vendorData: { [id: string]: ProductListCollectionData };
};

export const formatFacture = (
    products: Map<
        string,
        {
            vendor: ProductListCollectionData;
            products: Map<string, ShoppingCartItem>;
        }
    >,
    vendorCheck: BUYERROR
): FormatFactureData => {
    let newTotal = 0;
    let newVendorCheck: BUYERROR = vendorCheck;
    let lastVendorMap: {
        vendor: ProductListCollectionData;
        products: Map<string, ShoppingCartItem>;
    };
    const newProductPetition: { [id: string]: ProductFactureData[] } = {};
    const newVendorData: { [id: string]: ProductListCollectionData } = {};

    console.log("SUBMIT BUYING PETITION");
    console.log(products);
    products.forEach((vendorMap, key) => {
        if (
            newVendorCheck != BUYERROR.REGION &&
            lastVendorMap != null &&
            lastVendorMap != undefined
        ) {
            if (vendorMap.vendor.region != lastVendorMap.vendor.region) {
                newVendorCheck = BUYERROR.REGION;
            } else if (
                newVendorCheck != BUYERROR.COMMUNE &&
                vendorMap.vendor.commune != lastVendorMap.vendor.commune
            ) {
                newVendorCheck = BUYERROR.COMMUNE;
            }
        }

        lastVendorMap = vendorMap;
        newVendorData[key] = vendorMap.vendor;

        vendorMap.products.forEach((product) => {
            const { id, value, quantity } = product;

            let finalPrice = value.price;
            if (
                value.discount != undefined &&
                value.discount != null &&
                value.promotion != undefined &&
                value.promotion != null &&
                value?.discount != "none"
            ) {
                finalPrice -=
                    value.discount == "percentage"
                        ? (finalPrice * value.promotion) / 100
                        : value.promotion;
            }

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
            newTotal += finalPrice * quantity;
        });
    });

    return {
        buyError: newVendorCheck,
        priceTotal: newTotal,
        productPetition: newProductPetition,
        vendorData: newVendorData,
    };
};
