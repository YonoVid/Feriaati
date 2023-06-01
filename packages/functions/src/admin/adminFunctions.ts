import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { LoginFields, UpdateStateFields } from "../model/types";
import { ResponseData, UserToken } from "../model/reponseFields";
import { userStatus, userType } from "../model/accountTypes";

import { checkAccountFields } from "../utilities/checkAccount";
import { errorCodes, messagesCode } from "../errors";
import { accountLoginVerification } from "../utilities/account";
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
                    error: code === errorCodes.SUCCESFULL,
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

export const vendorList = functions.https.onCall(async () => {
    try {
        const db = admin.firestore();
        const usersRef = db.collection(collectionNames.VENDORS);
        const querySnapshot = await usersRef.get();
        const vendors: any[] = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            vendors.push({ ...userData, id: doc.id });
        });

        return vendors;
    } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al obtener datos de los vendedores"
        );
    }
});
export const vendorStateUpdate = functions.https.onCall(
    async (data: UpdateStateFields, context): Promise<ResponseData<null>> => {
        try {
            // obtiene id del usuario y el estado al que se desea alterar
            const { id, status } = data;

            const db = admin.firestore();
            const vendorRef = db.collection(collectionNames.VENDORS);
            const querySnapshot = await vendorRef.doc(id);

            if (
                (await querySnapshot.get()).exists &&
                (status === userStatus.activated ||
                    status === userStatus.blocked)
            ) {
                // Update vendor account state
                await vendorRef.doc(id).update({ status: status });

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
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al actualizar el estado del vendedor"
            );
        }
    }
);
