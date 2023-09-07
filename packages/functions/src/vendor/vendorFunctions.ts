import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRequestFields } from "../model/types";
import { ResponseData } from "../model/reponseFields";

import { getAccount } from "../utilities/account";

import { errorCodes, messagesCode } from "../errors";
import { collectionNames } from "../consts";
import { ProductFactureData } from "../model/productTypes";

export const checkPetitionVendor = functions.https.onCall(
    async (data: UserRequestFields): Promise<ResponseData<Array<string>>> => {
        try {
            let petitions: Array<ProductFactureData> = [];
            //Checks of data and database
            let code = errorCodes.SUCCESFULL;
            let check = true;
            //Get collection of email data

            functions.logger.info("DATA::", data);

            if (check) {
                let { code: accountCode, doc: collectionDoc } =
                    await getAccount(
                        collectionNames.VENDORS,
                        {
                            token: data.token,
                        },
                        true
                    );
                code = accountCode;
                functions.logger.info("DATA COLLECTION::", collectionDoc);
                if (accountCode == errorCodes.SUCCESFULL) {
                    const db = admin.firestore();
                    const queryProducts = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .where("vendorId", "==", collectionDoc.id as string);
                    const docReference = (await queryProducts.get()).docs[0];

                    if (docReference.exists) {
                        //Access documents from the collection an store them
                        const collectionDocuments = await docReference.ref
                            .collection(collectionNames.FACTURES)
                            .get();
                        for (let i = 0; i < collectionDocuments.size; i++) {
                            petitions.push(
                                collectionDocuments.docs[
                                    i
                                ].data() as ProductFactureData
                            );
                            if (petitions.length >= 20) {
                                break;
                            }
                        }
                    } else {
                        code = errorCodes.VENDOR_PERMISSION_ERROR;
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
