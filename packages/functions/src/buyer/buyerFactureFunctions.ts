import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FactureFields } from "../model/types";
import { ResponseData } from "../model/reponseFields";
import { errorCodes, messagesCode } from "../errors";

import { getAccount } from "../utilities/account";

import { collectionNames } from "../consts";
import { FactureData, ProductFactureData } from "../model/productTypes";
import { checkFactureFields } from "../utilities/checkFacture";
import { UserFactureCollectionStoredData } from "../model/transactionTypes";

/**
 * Function to log in user in the platform requires data of type LoginFields
 * @typeparam LoginFields - is the data from a login form
 */
export const getFactures = functions.https.onCall(
    async (
        data: FactureFields,
        context
    ): Promise<ResponseData<Array<FactureData>>> => {
        try {
            const { code, check } = checkFactureFields(data);

            if (check) {
                const { doc, code } = await getAccount(collectionNames.USERS, {
                    token: data.token,
                });
                if (code == errorCodes.SUCCESFULL) {
                    const factures: Array<FactureData> = [];

                    const db = admin.firestore();
                    const facturesDocs = await db
                        .collection(collectionNames.FACTURES)
                        .where("buyer", "==", doc.id)
                        .orderBy("date")
                        .startAt(data.index)
                        .limit(data.size)
                        .get();
                    facturesDocs.docs.forEach((doc) => {
                        const data =
                            doc.data() as UserFactureCollectionStoredData;
                        let products: Array<ProductFactureData> = [];
                        Object.keys(data.products).forEach((key) => {
                            products = products.concat(data.products[key]);
                        });

                        const newData: FactureData = {
                            id: doc.id,
                            status: data.status,
                            date: {
                                seconds: data.date.seconds,
                                nanoseconds: data.date.nanoseconds,
                            },
                            products: products,
                        };
                        functions.logger.info(newData);

                        factures.push(newData);
                    });
                    return {
                        error: code != errorCodes.SUCCESFULL,
                        code: code,
                        msg: messagesCode[code],
                        extra: factures,
                    };
                }
            }
            return {
                error: true,
                msg: messagesCode[code],
                code: code,
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
