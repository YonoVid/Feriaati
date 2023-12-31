import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    AccountUser,
    PasswordData,
    userStatus,
    userType,
} from "../model/accountTypes";
import Encryption, { getRandomBytes } from "./encryption";
import { errorCodes } from "../errors";
import { collectionNames } from "../consts";

export const accountLoginVerification = async (
    collection: collectionNames,
    email: string,
    password: string,
    attempt?: number
): Promise<{ token: string; code: errorCodes; id: string }> => {
    let token;
    let code = errorCodes.SUCCESFULL;
    try {
        const { code: accountCode, doc: userSnapshot } = await getAccount(
            collection,
            { email: email }
        );
        if (accountCode == errorCodes.SUCCESFULL) {
            const userData = userSnapshot.data() as AccountUser & PasswordData;
            functions.logger.info("DATA COLLECTION::", userData);
            if (
                userData?.type === userType.contributor ||
                (userData?.status === userStatus.activated &&
                    (userData?.token == null ||
                        userData?.token == undefined ||
                        userData?.token == ""))
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
                }
            } else if (userData?.type === userType.temp) {
                if (userData?.password !== password) {
                    if (attempt && attempt >= 5) {
                        code = errorCodes.BLOCKED_ACCOUNT_ERROR;
                    } else {
                        code = errorCodes.INCORRECT_PASSWORD_ERROR;
                    }
                }
            } else {
                if (userData?.status === (userStatus.blocked as string)) {
                    code = errorCodes.BLOCKED_ACCOUNT_ERROR;
                } else if (
                    userData?.status === (userStatus.registered as string)
                ) {
                    code = errorCodes.UNACTIVATED_ACCOUNT_ERROR;
                } else if (
                    userData?.token != null &&
                    userData?.token != undefined &&
                    userData?.token != ""
                ) {
                    code = errorCodes.ACTION_DONE_ERROR;
                } else {
                    code = errorCodes.USER_NOT_EXISTS_ERROR;
                }
            }
            if (code === errorCodes.SUCCESFULL) {
                token = getRandomBytes(20).toString("hex");
                await userSnapshot.ref.update({ token: token });
            } else if (code === errorCodes.BLOCKED_ACCOUNT_ERROR) {
                userSnapshot.ref.update({ status: userStatus.blocked });
            }
        } else {
            return {
                token: "",
                code: accountCode,
                id: "",
            };
        }
        return { token: token || "", code: code, id: userSnapshot.id || "" };
    } catch (e) {
        functions.logger.error("ERROR ON ACCOUNT LOGIN::", e);
        throw e;
    }
};

export const getAccount = async (
    collection: collectionNames,
    identificator: {
        id?: string;
        token?: string;
        email?: string;
    },
    createOnFail = false
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
    } else if (
        identificator.token &&
        identificator.token !== null &&
        identificator.token !== ""
    ) {
        functions.logger.info("ACCOUNT FROM TOKEN");
        const queryAccount = db
            .collection(collection)
            .where("token", "==", identificator.token);
        docReference = (await queryAccount.get()).docs[0];
    } else if (
        identificator.email &&
        identificator.email !== null &&
        identificator.email !== ""
    ) {
        functions.logger.info("ACCOUNT FROM EMAIL");
        const queryAccount = db
            .collection(collection)
            .where("email", "==", identificator.email);
        docReference = (await queryAccount.get()).docs[0];
    } else {
        return {
            doc: await db.collection(collection).doc().get(),
            code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
        };
    }

    if (!docReference && createOnFail) {
        const doc = db.collection(collection).doc();
        doc.set({});
        docReference = await doc.get();
        return {
            doc: docReference,
            code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
        };
    }
    functions.logger.info("ACCOUNT DOC::", docReference && docReference.id);

    return {
        doc: docReference,
        code:
            !docReference || !docReference.exists
                ? errorCodes.DOCUMENT_NOT_EXISTS_ERROR
                : errorCodes.SUCCESFULL,
    };
};

export const getAccountCount = async (search: {
    collection: collectionNames;
    value: any;
    field: string;
    exactSearch?: boolean;
}): Promise<{ code: errorCodes; quantity: number }> => {
    const { collection, value, field, exactSearch } = search;

    const db = admin.firestore();
    let docReference;
    if (
        value != null &&
        value != undefined &&
        field != null &&
        field != undefined
    ) {
        functions.logger.info("ACCOUNT FROM EMAIL");
        if (exactSearch) {
            const queryAccount = db
                .collection(collection)
                .where(field, "==", value);
            docReference = await queryAccount.get();
        } else {
            const queryAccount = db
                .collection(collection)
                .where(field, ">=", value)
                .where(field, "<=", value + "\uf8ff");
            docReference = await queryAccount.get();
        }
    } else {
        return {
            quantity: 0,
            code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
        };
    }

    return {
        quantity: docReference.docs.length || 0,
        code:
            !docReference || docReference.docs.length == 0
                ? errorCodes.DOCUMENT_NOT_EXISTS_ERROR
                : errorCodes.SUCCESFULL,
    };
};
