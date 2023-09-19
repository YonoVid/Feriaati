import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ProductFactureFields } from "../model/types";
import { ResponseData, VendorData } from "../model/reponseFields";
import { UserFactureCollectionData } from "../model/transactionTypes";
import { errorCodes, messagesCode } from "../errors";

import { getAccount } from "../utilities/account";

import { collectionNames } from "../consts";
import { getProductVendorList } from "../utilities/getList";
import { FactureData } from "../model/productTypes";
import { firestore } from "firebase-admin";

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
            //Checks of data and database
            let code = errorCodes.SUCCESFULL;
            let check =
                Object.keys(data.products).length > 0 || data.products != null;
            //Get collection of email data

            functions.logger.info("DATA::", data);

            if (check) {
                let { code: accountCode, doc: collectionDoc } =
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
                    //Setup document of user data
                    const collectionData: UserFactureCollectionData = {
                        date: new Date(),
                        buyer: collectionDoc.id,
                        products: data.products,
                    };
                    functions.logger.info("TO UPLOAD DATA::", collectionData);

                    //Creates document in collection of factures
                    const db = admin.firestore();
                    await db
                        .collection(collectionNames.FACTURES)
                        .doc()
                        .create(collectionData);

                    //Create product petition
                    for (let key in data.products) {
                        const { code, doc } = await getAccount(
                            collectionNames.VENDORPRODUCTS,
                            { id: key }
                        );
                        if (code === errorCodes.SUCCESFULL) {
                            const time = firestore.Timestamp.now();
                            const petitionData: FactureData = {
                                id: collectionDoc.id,
                                date: {
                                    seconds: time.seconds,
                                    nanoseconds: time.nanoseconds,
                                },
                                products: data.products[key],
                            };
                            doc.ref
                                .collection(collectionNames.FACTURES)
                                .doc()
                                .create(petitionData);
                        }
                    }
                } else {
                    code = errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR;
                }
            }

            // Returning results.
            return {
                extra: data.token,
                error: code !== errorCodes.SUCCESFULL,
                code: code,
                msg: messagesCode[code],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de los vendedores"
            );
        }
    }
);
