import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ResponseData } from "../model/reponseFields";
import {
    AccountCollectionData,
    ActualSubscription,
    SubscriptionCollectionData,
    SubscriptionData,
    SubscriptionStatus,
    userType,
    VendorCollectionData,
} from "../model/accountTypes";
import { errorCodes, messagesCode } from "../errors";
import { checkGetAccountFields } from "./checkAccount";
import {
    GetAccountFields,
    SubscriptionFields,
    UpdateFactureFields,
} from "../model/types";
import { collectionNames, constantNames } from "../consts";
import { getAccount } from "../utilities/account";
import { SubscriptionConstants } from "../model/dataTypes";
import { Timestamp } from "firebase-admin/firestore";
import { getConstant } from "../utilities/getConstant";

export const getAccountSubscription = functions.https.onCall(
    async (
        data: GetAccountFields,
        context: any
    ): Promise<ResponseData<SubscriptionData>> => {
        try {
            let { check, code } = checkGetAccountFields(data);

            if (check) {
                let { doc: docAccount, code: accountCode } = await getAccount(
                    data.type === userType.vendor
                        ? collectionNames.VENDORS
                        : collectionNames.USERS,
                    { id: data.id, token: data.token }
                );

                let subscriptionData: SubscriptionData | undefined;
                if (code === errorCodes.SUCCESFULL) {
                    let { doc: constantReference, code: constantCode } =
                        await getConstant(constantNames.SUBSCRIPTIONS);
                    if (code === errorCodes.SUCCESFULL) {
                        const constantData: SubscriptionConstants =
                            constantReference.data() as SubscriptionConstants;

                        const docData: AccountCollectionData =
                            docAccount.data() as AccountCollectionData;

                        subscriptionData = {
                            type: docData.type,
                            amountBase:
                                docData.type == userType.user
                                    ? constantData.buyerPrice
                                    : constantData.vendorPrice,
                            amountYear:
                                12 *
                                ((100 - constantData.yearDiscount) / 100.0) *
                                (docData.type == userType.user
                                    ? constantData.buyerPrice
                                    : constantData.vendorPrice),
                            expirationDate: docData.subscription?.expiration,
                        };
                        functions.logger.info("DATA::", subscriptionData);
                    } else {
                        code = constantCode;
                    }
                } else {
                    code = accountCode;
                }

                const error = code !== errorCodes.SUCCESFULL;
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                    extra: error ? {} : subscriptionData,
                };
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
                extra: {},
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError(
                "invalid-argument",
                "some message"
            );
        }
    }
);

export const setAccountSubscription = functions.https.onCall(
    async (
        data: SubscriptionFields,
        context: any
    ): Promise<ResponseData<string>> => {
        try {
            let { check, code } = checkGetAccountFields(data);

            if (check) {
                let { doc, code: accountCode } = await getAccount(
                    data.type === userType.vendor
                        ? collectionNames.VENDORS
                        : collectionNames.USERS,
                    { id: data.id, token: data.token }
                );

                let subscriptionData: SubscriptionCollectionData | undefined;
                if (code === errorCodes.SUCCESFULL) {
                    let { doc: constantReference, code: constantCode } =
                        await getConstant(constantNames.SUBSCRIPTIONS);
                    if (code === errorCodes.SUCCESFULL) {
                        const constantData: SubscriptionConstants =
                            constantReference.data() as SubscriptionConstants;
                        const checkCost =
                            (data.type == userType.user
                                ? constantData.buyerPrice
                                : constantData.vendorPrice) *
                            data.months *
                            (data.months == 12
                                ? (100 - constantData.yearDiscount) / 100
                                : 1);

                        functions.logger.info("CHECK COST::", checkCost);

                        if (checkCost == data.amount) {
                            const docData: AccountCollectionData =
                                doc.data() as AccountCollectionData;

                            const now = Timestamp.now();
                            const dateNow = new Date();
                            const expiration = Timestamp.fromDate(
                                new Date(
                                    dateNow.setMonth(
                                        dateNow.getMonth() + data.months
                                    )
                                )
                            );

                            subscriptionData = {
                                status: SubscriptionStatus.PROCESSING,
                                user: doc.id,
                                type: docData.type,
                                amount: data.amount,
                                expiration: {
                                    seconds: expiration.seconds,
                                    nanoseconds: expiration.nanoseconds,
                                },
                                date: {
                                    seconds: now.seconds,
                                    nanoseconds: now.nanoseconds,
                                },
                            };
                            functions.logger.info("DATA::", subscriptionData);

                            // Creates document in collection of factures
                            const db = admin.firestore();
                            const subscriptionDoc = db
                                .collection(collectionNames.SUBSCRIPTIONS)
                                .doc();

                            subscriptionDoc.create(subscriptionData);

                            const actualSubscription: ActualSubscription = {
                                expiration: subscriptionData.expiration,
                                renovation: false,
                            };

                            doc.ref.update({
                                actualSubscription: actualSubscription,
                            });

                            const error = code !== errorCodes.SUCCESFULL;
                            return {
                                error: error,
                                code: code,
                                msg: messagesCode[code],
                                extra: error ? {} : subscriptionDoc.id,
                            };
                        } else {
                            code = errorCodes.UNEXPECTED_ERROR;
                        }
                    } else {
                        code = constantCode;
                    }
                } else {
                    code = accountCode;
                }
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
                extra: {},
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError(
                "invalid-argument",
                "some message"
            );
        }
    }
);

export const updateSubscriptionFacture = async (
    data: UpdateFactureFields
): Promise<ResponseData<string>> => {
    try {
        let extra = data.facture;
        // Checks of data and database
        let code = errorCodes.SUCCESFULL;

        functions.logger.info("DATA::", data);

        if (data.token != null && data.status != null && data.facture != null) {
            const { code: accountCode, doc: collectionDoc } = await getAccount(
                collectionNames.USERS,
                {
                    token: data.token,
                },
                true
            );
            code = accountCode;
            functions.logger.info("DATA COLLECTION::", collectionDoc);
            if (accountCode == errorCodes.SUCCESFULL) {
                // Setup document of user data
                const db = admin.firestore();
                const factureDoc = await db
                    .collection(collectionNames.SUBSCRIPTIONS)
                    .doc(data.facture)
                    .get();
                functions.logger.info("TO UPLOAD DATA::", factureDoc);

                const factureData: SubscriptionCollectionData =
                    factureDoc.data() as SubscriptionCollectionData;

                if (factureDoc.exists && factureData.user == collectionDoc.id) {
                    // Update facture document status
                    await factureDoc.ref.update({ status: data.status });

                    const actualSubscription: ActualSubscription = {
                        expiration: factureData.expiration,
                        renovation: false,
                    };

                    await collectionDoc.ref.update({
                        subscription: actualSubscription,
                    });

                    if (factureData.type == userType.vendor) {
                        const vendorData: VendorCollectionData =
                            collectionDoc.data() as VendorCollectionData;
                        const productCollectionDoc = await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .doc(vendorData.productsId as string)
                            .get();

                        productCollectionDoc.ref.update({
                            subscription: actualSubscription,
                        });
                    }
                }
            } else {
                code = errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR;
            }
        }

        // Returning results.
        return {
            extra: extra,
            error: code !== errorCodes.SUCCESFULL,
            code: code,
            msg: messagesCode[code],
        };
    } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al generar petición de compra"
        );
    }
};
