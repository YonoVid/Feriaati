import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { userStatus, userType } from "../model/accountTypes";
import Encryption, { getRandomBytes } from "./encryption";
import { errorCodes } from "../errors";
import { collectionNames } from "../consts";

export const accountLoginVerification = async (
    collection: collectionNames,
    id: string,
    password: string,
    attempt?: number
) => {
    let code, token;
    try {
        const db = admin.firestore();
        const usersRef = db.collection(collection);
        const querySnapshot = usersRef.doc(id);
        const userDoc = await querySnapshot.get();
        let userData = userDoc.data();
        functions.logger.info("DATA COLLECTION::", userData);
        if (
            userDoc.exists &&
            userData?.status === (userStatus.activated as string)
        ) {
            const eConfig = {
                algorithm: userData?.algorithm,
                encryptionKey: process.env.ENCRYPTION_KEY,
                salt: "123",
                iv: userData?.iv as Buffer,
            };
            const desencryption = new Encryption(eConfig);

            if (userData?.password !== desencryption.encrypt(password)) {
                if (attempt && attempt >= 5) {
                    code = errorCodes.BLOCKED_ACCOUNT_ERROR;
                } else {
                    code = errorCodes.INCORRECT_PASSWORD_ERROR;
                }
            } else {
                code = errorCodes.SUCCESFULL;
            }
        } else if (userData?.type === userType.temp) {
            if (userData?.password !== password) {
                if (attempt && attempt >= 5) {
                    code = errorCodes.BLOCKED_ACCOUNT_ERROR;
                } else {
                    code = errorCodes.INCORRECT_PASSWORD_ERROR;
                }
            } else {
                code = errorCodes.SUCCESFULL;
            }
        } else {
            if (userData?.status === (userStatus.blocked as string)) {
                code = errorCodes.BLOCKED_ACCOUNT_ERROR;
            } else {
                code = errorCodes.USER_NOT_EXISTS_ERROR;
            }
        }
        if (code === errorCodes.SUCCESFULL) {
            token = getRandomBytes(20).toString("hex");
            await querySnapshot.update({ token: token });
        } else if (code === errorCodes.BLOCKED_ACCOUNT_ERROR) {
            accountLoginVerification;
            querySnapshot.update({ status: userStatus.blocked });
        }
    } catch (e) {
        functions.logger.error("ERROR ON ACCOUNT LOGIN::", e);
        throw e;
    }

    return { token: token, code: code };
};

export const getAccount = async (
    collection: collectionNames,
    identificator: {
        id?: string;
        token?: string;
    }
): Promise<{ code: errorCodes; doc: admin.firestore.DocumentSnapshot }> => {
    const db = admin.firestore();
    let docReference;
    if (
        identificator.id &&
        identificator.id !== null &&
        identificator.id !== ""
    ) {
        functions.logger.info("ACCOUNT FROM ID");
        docReference = await db
            .collection(collection)
            .doc(identificator.id as string)
            .get();
    } else {
        functions.logger.info("ACCOUNT FROM TOKEN");
        const queryAccount = db
            .collection(collection)
            .where("token", "==", identificator.token);
        docReference = (await queryAccount.get()).docs[0];
    }

    functions.logger.info("ACCOUNT DOC::", docReference);

    if (!docReference.exists) {
        return {
            doc: docReference,
            code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
        };
    }
    return { doc: docReference, code: errorCodes.SUCCESFULL };
};
