import * as functions from "firebase-functions";
import { ResponseData } from "../model/reponseFields";
import {
    AccountCollectionData,
    AccountData,
    userType,
} from "../model/accountTypes";
import { errorCodes, messagesCode } from "../errors";
import { checkEditAccountFields, checkGetAccountFields } from "./checkAccount";
import { EditAccountFields, GetAccountFields } from "../model/types";
import { collectionNames } from "../consts";
import { getAccount } from "../utilities/account";

export const getAccountUser = functions.https.onCall(
    async (
        data: GetAccountFields,
        context: any
    ): Promise<ResponseData<AccountCollectionData>> => {
        try {
            let { check, code } = checkGetAccountFields(data);

            if (check) {
                let { doc, code } = await getAccount(
                    data.type === userType.vendor
                        ? collectionNames.VENDORS
                        : collectionNames.USERS,
                    { id: data.id, token: data.token }
                );

                let accountData: AccountData | undefined;
                if (code === errorCodes.SUCCESFULL) {
                    const docData: AccountCollectionData =
                        doc.data() as AccountCollectionData;
                    accountData = {
                        type: docData.type,
                        email: docData.email,
                        password: "**********",
                        phone: docData.phone,
                        direction: docData.direction,
                    };
                    functions.logger.info("DATA::", accountData);
                }

                const error = code !== "00000";
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                    extra: error ? {} : accountData,
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

export const editAccountUser = functions.https.onCall(
    async (
        data: EditAccountFields,
        context: any
    ): Promise<ResponseData<AccountCollectionData>> => {
        try {
            functions.logger.info("DATA::", data);
            let { check, code } = checkEditAccountFields(data);

            if (check) {
                let { doc, code } = await getAccount(
                    data.type === userType.vendor
                        ? collectionNames.VENDORS
                        : collectionNames.USERS,
                    { id: data.id, token: data.token }
                );
                let accountData: AccountData | undefined;
                if (code === errorCodes.SUCCESFULL) {
                    const docData: AccountCollectionData =
                        doc.data() as AccountCollectionData;
                    accountData = {
                        type: docData.type,
                        email: data.email ? data.email : docData.email,
                        password: data.password
                            ? data.password
                            : docData.password,
                    };
                    data.direction && (accountData.direction = data.direction);
                    data.phone && (accountData.phone = data.phone);

                    if (docData !== accountData) {
                        functions.logger.info({ ...docData, ...accountData });
                        await doc.ref.update({ ...docData, ...accountData });
                    }
                }
                //Hide password for return message
                accountData && (accountData.password = "**********");

                const error = code !== "00000";
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                    extra: error ? {} : accountData,
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
