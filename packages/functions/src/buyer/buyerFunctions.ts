import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ProductFactureFields, UpdateFactureFields } from "../model/types";
import { ResponseData, VendorData } from "../model/reponseFields";
import { UserFactureCollectionData } from "../model/transactionTypes";
import { errorCodes, messagesCode } from "../errors";

import { getAccount } from "../utilities/account";

import { collectionNames } from "../consts";
import { getProductVendorList } from "../utilities/getList";
import { FactureStatus } from "../model/productTypes";
import { Timestamp } from "firebase-admin/firestore";
import { checkBuyProduct } from "./checkBuyer";
import { registerFactureData } from "../vendor/vendorFactureFunctions";

export const vendorListUser = functions.https.onCall(
    async (data: string): Promise<ResponseData<VendorData[]>> => {
        try {
            return getProductVendorList(data, collectionNames.USERS);
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de los vendedores"
            );
        }
    }
);

export const buyProductUser = functions.https.onCall(
    async (data: ProductFactureFields): Promise<ResponseData<string>> => {
        try {
            // Return facture data
            let extra = data.token;
            // Checks of data and database
            let { check, code } = await checkBuyProduct(data);
            // Get collection of email data

            functions.logger.info("DATA::", data);

            if (check) {
                const { code: accountCode, doc: collectionDoc } =
                    await getAccount(
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
                    const collectionData: UserFactureCollectionData = {
                        date: new Date(),
                        status: FactureStatus.PROCESSING,
                        buyer: collectionDoc.id,
                        products: data.products,
                    };
                    functions.logger.info("TO UPLOAD DATA::", collectionData);

                    // Creates document in collection of factures
                    const db = admin.firestore();
                    const factureDoc = db
                        .collection(collectionNames.FACTURES)
                        .doc();

                    await factureDoc.create(collectionData);

                    extra = factureDoc.id;
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
    }
);

export const updateBuyerFacture = async (
    data: UpdateFactureFields
): Promise<ResponseData<string>> => {
    try {
        const extra = data.facture;
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
                    .collection(collectionNames.FACTURES)
                    .doc(data.facture)
                    .get();
                functions.logger.info("TO UPLOAD DATA::", factureDoc);

                const factureData: UserFactureCollectionData =
                    factureDoc.data() as UserFactureCollectionData;

                if (
                    factureDoc.exists &&
                    factureData.buyer == collectionDoc.id &&
                    factureData.status != FactureStatus.APPROVED
                ) {
                    // Update facture document status
                    await factureDoc.ref.update({ status: data.status });

                    const time = Timestamp.now();

                    for (const key in factureData.products) {
                        if (key) {
                            registerFactureData({
                                docId: factureDoc.id,
                                id: key,
                                products: factureData.products[key],
                                time: time,
                            });
                        }
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
