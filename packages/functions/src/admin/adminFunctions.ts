import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { LoginFields, UpdateStateFields } from "../model/types";
import {
    ProductListData,
    ResponseData,
    UserToken,
} from "../model/reponseFields";
import { userStatus, userType } from "../model/accountTypes";

import { checkAccountFields } from "../utilities/checkAccount";
import { errorCodes, messagesCode } from "../errors";
import { accountLoginVerification, getAccount } from "../utilities/account";
import { collectionNames } from "../consts";

// ?REFERENCE FUNCTION
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const adminLogin = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData<UserToken>> => {
        try {
            const { email, password, attempts } = data;
            //Check fields format
            let { check, code } = checkAccountFields(data);

            if (check) {
                let { token, code } = await accountLoginVerification(
                    collectionNames.ADMINS,
                    email,
                    password,
                    attempts
                );
                return {
                    error: code !== errorCodes.SUCCESFULL,
                    code: code,
                    msg: messagesCode[code],
                    extra: {
                        token: token as string,
                        email: data.email,
                        type: userType.admin,
                    },
                };
            }
            // Returning results.
            return {
                error: true,
                code: code,
                msg: messagesCode[code],
                extra: { token: "", email: data.email },
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

export const productVendorList = functions.https.onCall(
    async (data: string): Promise<ResponseData<ProductListData[]>> => {
        try {
            const { code: adminCode } = await getAccount(
                collectionNames.ADMINS,
                { token: data }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const usersRef = db.collection(collectionNames.VENDORPRODUCTS);
                const querySnapshot = await usersRef.get();
                const vendors: ProductListData[] = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data() as ProductListData;
                    vendors.push({ ...userData, id: doc.id });
                });

                return {
                    error: false,
                    code: errorCodes.SUCCESFULL,
                    msg: messagesCode[errorCodes.SUCCESFULL],
                    extra: vendors,
                };
            }
            return {
                error: true,
                code: errorCodes.ADMIN_NOT_EXISTS_ERROR,
                msg: messagesCode[errorCodes.ADMIN_NOT_EXISTS_ERROR],
                extra: [],
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

export const deleteUser = functions.https.onCall(
    async (data: UpdateStateFields, context): Promise<ResponseData<null>> => {
        try {
            // Get call data
            const { token, itemId, status } = data;

            const { code: adminCode, doc: adminDoc } = await getAccount(
                collectionNames.ADMINS,
                { token: token }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const vendorRef = db.collection(collectionNames.VENDORS);
                const querySnapshot = await vendorRef.doc(itemId);
                const vendorDoc = await querySnapshot.get();

                if (
                    vendorDoc.exists &&
                    (status === userStatus.activated ||
                        status === userStatus.blocked)
                ) {
                    // Update vendor account state
                    await vendorRef.doc(itemId).update({
                        status: status,
                        deleteDate: new Date(),
                        userDelete: adminDoc.id,
                    });

                    return {
                        error: false,
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                    };
                }
                return {
                    error: true,
                    code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                    msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                };
            }
            return {
                error: true,
                code: errorCodes.ADMIN_NOT_EXISTS_ERROR,
                msg: messagesCode[errorCodes.ADMIN_NOT_EXISTS_ERROR],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al actualizar el estado del vendedor"
            );
        }
    }
);
