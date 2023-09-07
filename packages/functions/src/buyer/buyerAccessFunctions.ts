import * as functions from "firebase-functions";
import {
    RegisterConfirm,
    RegisterFields,
    LoginFields,
    UpdatePassFields,
    RecoveryFields,
} from "../model/types";
import { ResponseData, UserToken } from "../model/reponseFields";
import {
    UserCollectionData,
    userStatus,
    userType,
} from "../model/accountTypes";
import { getRandomIntString } from "../utilities/random";
import { errorCodes, messagesCode } from "../errors";

import { checkRegisterFields } from "./checkRegister";
import { sendVerificationMail } from "../utilities/mail";
import { accountLoginVerification, getAccount } from "../utilities/account";
import { checkAccountFields } from "../utilities/checkAccount";

import { encryption, config } from "../utilities/encryption";
import {
    updateAccountCode,
    updateAccountPassword,
} from "../utilities/updateAccount";
import { collectionNames } from "../consts";

/**
 * Function to log in user in the platform requires data of type LoginFields
 * @typeparam LoginFields - is the data from a login form
 */
export const login = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData<UserToken>> => {
        try {
            let { code, check } = checkAccountFields(data);

            if (check) {
                let { token, code, id } = await accountLoginVerification(
                    collectionNames.USERS,
                    data.email,
                    data.password,
                    data.attempts
                );
                const error = code !== errorCodes.SUCCESFULL;
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                    extra: error
                        ? {}
                        : {
                              type: userType.user,
                              token: token,
                              email: data.email,
                              id: id,
                          },
                };
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
/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
export const addUser = functions.https.onCall(
    async (data: RegisterFields, context): Promise<ResponseData<string>> => {
        try {
            //Checks of data and database
            let { check, code } = checkRegisterFields(data);
            let error = false;
            //Get collection of email data

            functions.logger.info("DATA::", data);

            if (check) {
                let { code: accountCode, doc: collectionDoc } =
                    await getAccount(
                        collectionNames.USERS,
                        {
                            email: data.email,
                        },
                        true
                    );
                code = accountCode;
                functions.logger.info("DATA COLLECTION::", collectionDoc);
                if (
                    accountCode === errorCodes.DOCUMENT_NOT_EXISTS_ERROR ||
                    collectionDoc.get("status") === userStatus.registered
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
                    if (collectionDoc && collectionDoc.exists) {
                        //Update document in collection if exists
                        collectionDoc.ref.update(collectionData);
                    } else {
                        //Creates document in collection of users
                        collectionDoc.ref.create(collectionData);
                    }
                    code = errorCodes.SUCCESFULL;
                } else {
                    code = errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR;
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
            //Store return message
            let code = errorCodes.SUCCESFULL;
            functions.logger.info("DATA", data);
            //Checks of data and database
            let { code: accountCode, doc: collectionDoc } = await getAccount(
                collectionNames.USERS,
                {
                    email: data.email,
                }
            );

            functions.logger.info("DATA COLLECTION::", collectionDoc);

            if (
                accountCode !== errorCodes.DOCUMENT_NOT_EXISTS_ERROR &&
                collectionDoc.get("code") === data.code
            ) {
                //Update document of user data
                collectionDoc.ref.update({
                    status: userStatus.activated as string,
                });

                code = errorCodes.SUCCESFULL;
            } else if (accountCode !== errorCodes.DOCUMENT_NOT_EXISTS_ERROR) {
                code = errorCodes.INCORRECT_CODE_ERROR;
            } else {
                code = errorCodes.USER_NOT_EXISTS_ERROR;
            }
            // Returning results.
            return {
                extra: data.email,
                error: code !== errorCodes.SUCCESFULL,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);

export const passRecovery = functions.https.onCall(
    async (data: RecoveryFields): Promise<ResponseData<any>> => {
        return updateAccountCode(collectionNames.USERS, data);
    }
);
export const passUpdate = functions.https.onCall(
    async (data: UpdatePassFields): Promise<ResponseData<string>> => {
        const { email, code } = await updateAccountPassword(
            collectionNames.USERS,
            data
        );
        return {
            msg: messagesCode[code],
            code: code,
            error: code !== errorCodes.SUCCESFULL,
            extra: email,
        };
    }
);
