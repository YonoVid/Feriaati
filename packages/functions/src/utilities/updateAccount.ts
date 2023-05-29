import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { RecoveryFields, UpdatePassFields } from "../model/types";
import { getRandomIntString } from "./random";
import { sendRecoveryMail } from "./mail";
import { messagesCode } from "../errors";
import { checkUpdatePassFields } from "./checkUpdate";
import { encryption } from "./encryption";
import { userStatus } from "../model/accountTypes";

export const updateAccountCode = async (
    collection: string,
    data: RecoveryFields
) => {
    const db = admin.firestore();
    //Checks of data and database
    let check = data.email != null && data.email != "";
    //Get collection of email data
    const collectionDocReference = db.collection(collection).doc(data.email);
    const collectionDoc = await collectionDocReference.get();
    if (check) {
        if (collectionDoc.exists) {
            const userDoc = await collectionDocReference.get();
            if (userDoc.data()?.status === userStatus.activated) {
                const codigo = getRandomIntString(999999);
                sendRecoveryMail("", data.email, codigo);
                collectionDocReference.update({ passwordCode: codigo });
                // Returning results.
                return {
                    extra: data.email,
                    error: false,
                    code: "00000",
                    msg: messagesCode["00000"],
                };
            }
        } else {
            return {
                extra: data.email,
                error: true,
                code: "ERD02",
                msg: messagesCode["ERD02"],
            };
        }
    }
    return {
        extra: data.email,
        error: true,
        code: "ERR02",
        msg: messagesCode["ERR02"],
    };
};

export const updateAccountPassword = async (
    collection: string,
    data: UpdatePassFields
) => {
    const db = admin.firestore();
    functions.logger.info(data);

    //Get collection of email data
    const collectionDocReference = db.collection(collection).doc(data.email);
    const collectionDoc = await collectionDocReference.get();
    if (collectionDoc.exists) {
        //Checks of data and database
        let { code, check } = checkUpdatePassFields(data);
        if (check) {
            const userDoc = collectionDoc.data();
            if (userDoc?.status === userStatus.activated) {
                if (userDoc?.passwordCode === data.codigo) {
                    collectionDocReference.update({
                        password: encryption.encrypt(data.password),
                    });
                    // Returning results.
                    return {
                        extra: data.email,
                        error: false,
                        code: "00000",
                        msg: messagesCode["00000"],
                    };
                }
                // Returning results.
                return {
                    extra: data.email,
                    error: false,
                    code: "ERR05",
                    msg: messagesCode["ERR05"],
                };
            }
        } else {
            return {
                extra: data.email,
                error: true,
                code: code,
                msg: messagesCode[code],
            };
        }
    }
    return {
        extra: data.email,
        error: true,
        code: "ERD02",
        msg: messagesCode["ERD02"],
    };
};
