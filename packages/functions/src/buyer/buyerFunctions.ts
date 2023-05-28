import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    ResponseData,
    RegisterConfirm,
    RegisterFields,
    LoginFields,
    UpdatePassFields,
    UserToken,
} from "../model/types";
import {
    UserCollectionData,
    userStatus,
    userType,
} from "../model/accountTypes";
import Encryption, { generativeIvOfSize } from "../utilities/encryption";
import { getRandomIntString } from "../utilities/random";
import { messagesCode } from "../errors";

import { checkRegisterFields } from "./checkRegister";
import { checkUpdatePassFields } from "../utilities/checkUpdate";
import { sendRecoveryMail, sendVerificationMail } from "../utilities/mail";
import { accountLoginVerification } from "../utilities/account";
import { checkAccountFields } from "../utilities/checkAccount";

//Setup encryption configuration
//IF YOU USE .env first install dotenv (npm install dotenv --save)
const config = {
    algorithm: process.env.ENCRYPTION_ALGORITHM, //"aes-256-cbc"
    encryptionKey: process.env.ENCRYPTION_KEY, //"KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ"
    salt: process.env.ENCRYPTION_SALT, //"123" IRRELEVANTE
    iv: generativeIvOfSize(16),
};
const encryption = new Encryption(config);

/**
 * Function to log in user in the platform requires data of type LoginFields
 * @typeparam LoginFields - is the data from a login form
 */
export const login = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData<UserToken>> => {
        try {
            let { code, check } = checkAccountFields(data);

            if (check) {
                let { token, code } = await accountLoginVerification(
                    "users",
                    data.email,
                    data.password,
                    data.attempts
                );
                return {
                    error: code === "00000",
                    code: code,
                    msg: messagesCode[code],
                    extra: {
                        type: userType.user,
                        token: token,
                        email: data.email,
                    },
                };
            }
            return {
                error: true,
                msg: messagesCode[code],
                code: code,
                extra: { type: userType.user, token: "", email: data.email },
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
/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
export const addUser = functions.https.onCall(
    async (data: RegisterFields, context): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            //Checks of data and database
            let { check, code } = checkRegisterFields(data);
            let error = false;
            //Get collection of email data
            const collectionDocReference = db
                .collection("users")
                .doc(data.email);
            const collectionDoc = await collectionDocReference.get();

            functions.logger.info("DATA::", data);
            functions.logger.info("DATA COLLECTION::", collectionDoc);

            if (check) {
                if (
                    !collectionDoc.exists ||
                    collectionDoc.get("status") === "registered"
                ) {
                    //Setup document of user data
                    const collectionData: UserCollectionData = {
                        type: userType.user,
                        username: data.username,
                        email: data.email,
                        password: encryption.encrypt(data.password),
                        algorithm: config.algorithm as string,
                        status: (data.status as string) || "null",
                        iv: config.iv,
                        code: getRandomIntString(999999),
                    };
                    functions.logger.info("TO UPLOAD DATA::", collectionData);

                    //Send email to user with verification code
                    sendVerificationMail(
                        data.username,
                        data.email,
                        collectionData.code
                    );
                    if (collectionDoc.exists) {
                        //Update document in collection if exists
                        collectionDocReference.update(collectionData);
                    } else {
                        //Creates document in collection of users
                        collectionDocReference.create(collectionData);
                    }
                    code = "00000";
                } else if (collectionDoc.exists) {
                    code = "ERD01";
                    error = true;
                }
            } else {
                error = true;
            }

            // Returning results.
            return {
                extra: data.email,
                error: error,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);

/**
 * Function to confirm register of user in the platform requires data of type RegisterConfirm
 * @typeparam RegisterConfirm - is the data from a confirm register form
 */
export const confirmRegister = functions.https.onCall(
    async (data: RegisterConfirm, context): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            //Store return message
            let code = "";
            let error = false;
            functions.logger.info("DATA", data);
            //Checks of data and database
            const collectionDocReference = db
                .collection("users")
                .doc(data.email);

            const collectionDoc = await collectionDocReference.get();

            functions.logger.info("DATA COLLECTION::", collectionDoc);

            if (
                collectionDoc.exists &&
                collectionDoc.get("code") === data.code
            ) {
                //Update document of user data
                collectionDocReference.update({
                    status: userStatus.activated as string,
                });

                code = "00000";
            } else if (collectionDoc.exists) {
                error = true;
                code = "ERR04";
            }

            // Returning results.
            return {
                extra: data.email,
                error: error,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);

export const passRecovery = functions.https.onCall(async (email: string) => {
    const db = admin.firestore();
    const codigo = getRandomIntString(999999);
    sendRecoveryMail("", email, codigo);
    db.collection("users").doc(email).update({ passwordCode: codigo });
});
export const passUpdate = functions.https.onCall(
    async (data: UpdatePassFields) => {
        const db = admin.firestore();
        let { msg } = checkUpdatePassFields(data);
        const usersRef = db.collection("users");
        const querySnapshot = usersRef.doc(data.email);
        const userDocR = await querySnapshot.get();
        const userDoc = userDocR.data();
        //console.log(userDoc?.passwordCode);
        functions.logger.info(data.codigo);
        if (userDoc?.passwordCode === data.codigo) {
            functions.logger.info("hola");
            db.collection("users")
                .doc(data.email)
                .update({ password: encryption.encrypt(data.password) });
            msg = "Contraseña actualizada con éxito";
        }
        return { mensaje: "data.codigo", msg: msg };
    }
);
