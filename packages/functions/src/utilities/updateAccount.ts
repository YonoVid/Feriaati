import * as functions from "firebase-functions";
import { RecoveryFields, UpdatePassFields } from "../model/types";
import { getRandomIntString } from "./random";
import { sendRecoveryMail } from "./mail";
import { errorCodes, messagesCode } from "../errors";
import { checkUpdatePassFields } from "./checkUpdate";
import { encryption, config } from "./encryption";
import {
    AccountCollectionData,
    PasswordData,
    userStatus,
} from "../model/accountTypes";
import { getAccount } from "./account";
import { collectionNames } from "../consts";

export const updateAccountCode = async (
    collection: collectionNames,
    data: RecoveryFields
) => {
    //Checks of data and database
    let check = data.email != null && data.email != "";
    //Get collection of email data
    const { code, doc: userDoc } = await getAccount(collection, {
        email: data.email,
    });

    if (check) {
        if (code == errorCodes.SUCCESFULL) {
            if (userDoc.data()?.status === userStatus.activated) {
                const codigo = getRandomIntString(999999);
                sendRecoveryMail("", data.email, codigo);
                userDoc.ref.update({ passwordCode: codigo });
                // Returning results.
                return {
                    extra: data.email,
                    error: false,
                    code: errorCodes.SUCCESFULL,
                    msg: messagesCode[errorCodes.SUCCESFULL],
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
    collection: collectionNames,
    data: UpdatePassFields,
    checkCode: boolean = true
): Promise<{ code: errorCodes; email: string }> => {
    functions.logger.info(data);

    //Get collection of email data
    const { code, doc: collectionDoc } = await getAccount(collection, {
        email: data.email,
    });
    if (code == errorCodes.SUCCESFULL) {
        //Checks of data and database
        let { code, check } = checkUpdatePassFields(data);
        if (check) {
            const userDoc = collectionDoc.data();
            if (userDoc?.status === userStatus.activated) {
                if (!checkCode || userDoc?.passwordCode === data.codigo) {
                    let updateData: Partial<AccountCollectionData> = {
                        password: encryption.encrypt(data.password),
                        iv: config.iv,
                        algorithm: config.algorithm,
                    };
                    collectionDoc.ref.update(updateData);
                    // Returning results.
                    return {
                        email: data.email,
                        code: errorCodes.SUCCESFULL,
                    };
                }
                // Returning results.
                return {
                    email: data.email,
                    code: errorCodes.INCORRECT_CODE_ERROR,
                };
            }
        } else {
            return {
                email: data.email,
                code: code,
            };
        }
    }
    return {
        email: data.email,
        code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
    };
};

export const updatePasswordValues = (data: UpdatePassFields): PasswordData => {
    return {
        password: encryption.encrypt(data.password),
        iv: config.iv,
        algorithm: config.algorithm as string,
        code: "",
    };
};
