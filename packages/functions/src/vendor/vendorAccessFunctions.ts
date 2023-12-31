import * as functions from "firebase-functions";
import {
    LoginFields,
    RecoveryFields,
    RegisterVendorFields,
    UpdatePassFields,
} from "../model/types";
import { ResponseData, UserToken } from "../model/reponseFields";
import { userType, VendorCollectionData } from "../model/accountTypes";

// import { sendVerificationMail } from "../utilities/mail";
import Encryption, { generativeIvOfSize } from "../utilities/encryption";
import { getRandomIntString } from "../utilities/random";
import { uploadRegisterImage } from "../utilities/storage";
import { checkAccountFields } from "../utilities/checkAccount";
import { accountLoginVerification, getAccount } from "../utilities/account";
import {
    updateAccountCode,
    updateAccountPassword,
} from "../utilities/updateAccount";

import { errorCodes, messagesCode } from "../errors";
import { collectionNames } from "../consts";
import { checkRegisterVendorFields } from "./checkVendor";

// Setup encryption configuration
// IF YOU USE .env first install dotenv (npm install dotenv --save)
const config = {
    algorithm: process.env.ENCRYPTION_ALGORITHM, // "aes-256-cbc"
    encryptionKey: process.env.ENCRYPTION_KEY, // "KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ"
    salt: process.env.ENCRYPTION_SALT, // "123" IRRELEVANTE
    iv: generativeIvOfSize(16),
};
const encryption = new Encryption(config);

/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
export const addVendor = functions.https.onCall(
    async (
        data: RegisterVendorFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            // Checks of data and database
            let { check, code } = checkRegisterVendorFields(data);
            let error = false;

            functions.logger.info("DATA::", data);

            if (check) {
                // Get collection of email data
                const { code: accountCode, doc: collectionDoc } =
                    await getAccount(
                        collectionNames.VENDORS,
                        {
                            email: data.email,
                        },
                        true
                    );
                code = accountCode;
                functions.logger.info("DATA COLLECTION::", collectionDoc);
                if (
                    accountCode === errorCodes.DOCUMENT_NOT_EXISTS_ERROR ||
                    collectionDoc.get("status") === "registered"
                ) {
                    functions.logger.info(
                        "IMAGE HAS DATA::",
                        data.image != null
                    );
                    // Upload image
                    const imageURL = await uploadRegisterImage(
                        data.email,
                        data.image
                    );
                    // Setup document of user data
                    const collectionData: VendorCollectionData = {
                        creationDate: new Date(),
                        isDeleted: false,
                        productsId: "ungenerated",
                        type: userType.vendor,
                        rut: data.rut,
                        enterpriseName: data.enterpriseName,
                        localNumber: data.localNumber,
                        region: data.region,
                        commune: data.commune,
                        street: data.street,
                        streetNumber: data.streetNumber,
                        name: data.name,
                        surname: data.surname,
                        image: imageURL,
                        email: data.email,
                        password: encryption.encrypt(data.password),
                        algorithm: config.algorithm as string,
                        status: (data.status as string) || "null",
                        iv: config.iv,
                        code: getRandomIntString(999999),
                    };
                    functions.logger.info("TO UPLOAD DATA::", collectionData);

                    if (collectionDoc.exists) {
                        // Update document in collection if exists
                        collectionDoc.ref.update(collectionData);
                    } else {
                        // Creates document in collection of users
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

// Login vendedor
export const loginVendor = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData<UserToken>> => {
        try {
            const { check, code } = checkAccountFields(data);

            if (check) {
                const isContributor = data.email.includes("@feriaati.cl");

                const { token, code, id } = await accountLoginVerification(
                    isContributor
                        ? collectionNames.CONTRIBUTORS
                        : collectionNames.VENDORS,
                    data.email,
                    data.password,
                    data.attempts
                );
                const error = code !== "00000";
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                    extra: error
                        ? {}
                        : {
                              type: isContributor
                                  ? userType.contributor
                                  : userType.vendor,
                              token: token,
                              email: data.email,
                              id: id,
                          },
                };
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
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
// envío de codigo al correo de vendedor
export const passRecoveryVendor = functions.https.onCall(
    async (data: RecoveryFields): Promise<ResponseData<string>> => {
        return updateAccountCode(collectionNames.VENDORS, data);
    }
);
// actualización de contraseña con el código enviado al correo
export const passUpdateVendor = functions.https.onCall(
    async (data: UpdatePassFields): Promise<ResponseData<string>> => {
        const { email, code } = await updateAccountPassword(
            collectionNames.VENDORS,
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
