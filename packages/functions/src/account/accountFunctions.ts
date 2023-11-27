import * as functions from "firebase-functions";
import { ResponseData } from "../model/reponseFields";
import {
    AccountCollectionData,
    AccountData,
    UserCollection,
    userType,
} from "../model/accountTypes";
import { errorCodes, messagesCode } from "../errors";
import { checkEditAccountFields, checkGetAccountFields } from "./checkAccount";
import {
    EditAccountFields,
    FactureTypes,
    GetAccountFields,
    LogoutFields,
    UpdateFactureFields,
} from "../model/types";
import { getAccount } from "../utilities/account";
import { updateAccountPassword } from "../utilities/updateAccount";
import { updateBuyerFacture } from "../buyer/buyerFunctions";
import { updateSubscriptionFacture } from "./accountSubscriptionFunctions";

export const getAccountUserLocal = async (
    data: GetAccountFields,
    context: any
): Promise<ResponseData<AccountCollectionData>> => {
    try {
        const { check, code } = checkGetAccountFields(data);

        if (check) {
            const { doc, code } = await getAccount(UserCollection[data.type], {
                id: data.id,
                token: data.token,
                email: data.email,
            });

            let accountData: AccountData | undefined;
            if (code === errorCodes.SUCCESFULL) {
                const docData: AccountCollectionData =
                    doc.data() as AccountCollectionData;
                accountData = {
                    creationDate: new Date(),
                    status: docData.status,
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
};

export const editAccountUserLocal = async (
    data: EditAccountFields,
    context: any
): Promise<ResponseData<AccountCollectionData>> => {
    try {
        functions.logger.info("DATA::", data);
        const { check, code } = checkEditAccountFields(data);

        if (check) {
            const accountCollection =
                UserCollection[data.type || userType.user];
            let { doc, code } = await getAccount(accountCollection, {
                id: data.id,
                token: data.token,
            });
            let accountData: Partial<AccountCollectionData> | undefined;
            if (code === errorCodes.SUCCESFULL) {
                const docData: AccountCollectionData =
                    doc.data() as AccountCollectionData;
                if (data.password && data.password != null) {
                    const { code: codePassword } = await updateAccountPassword(
                        accountCollection,
                        {
                            email: docData.email,
                            codigo: "",
                            password: data.password,
                            confirmPassword: data.password,
                        },
                        false
                    );
                    code = codePassword;
                }
                accountData = {
                    type: docData.type,
                    email: data.email ? data.email : docData.email,
                };
                if (data.direction) {
                    accountData.direction = data.direction;
                } else if (
                    docData.direction &&
                    docData.direction != null &&
                    docData.direction.length > 0
                ) {
                    accountData.direction = [];
                }

                data.phone && (accountData.phone = data.phone);

                if (docData !== accountData) {
                    functions.logger.info({ ...docData, ...accountData });
                    await doc.ref.update({ ...docData, ...accountData });
                }
            }
            // Hide password for return message
            accountData && (accountData.password = "**********");

            const error = code !== errorCodes.SUCCESFULL;
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
};

export const logoutUser = functions.https.onCall(
    async (data: LogoutFields, context: any): Promise<ResponseData<null>> => {
        try {
            functions.logger.info("DATA::", data);
            const check =
                data.token != null &&
                data.token != undefined &&
                data.type != null &&
                data.type != undefined;

            if (check) {
                const accountCollection = UserCollection[data.type];
                const { doc, code } = await getAccount(accountCollection, {
                    token: data.token,
                });
                if (code === errorCodes.SUCCESFULL) {
                    doc.ref.update({ token: null });
                }

                const error = code !== errorCodes.SUCCESFULL;
                return {
                    error: error,
                    code: code,
                    msg: messagesCode[code],
                };
            }
            return {
                msg: messagesCode[errorCodes.MISSING_REQUIRED_DATA_ERROR],
                code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
                error: true,
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

export const updateUserFacture = functions.https.onCall(
    async (data: UpdateFactureFields): Promise<ResponseData<string>> => {
        try {
            functions.logger.info("DATA::", data);

            if (data.type == FactureTypes.PRODUCTS) {
                functions.logger.info("UPDATING PRODUCTS FACTURE");
                return updateBuyerFacture(data);
            } else if (data.type == FactureTypes.SUBSCRIPTION) {
                functions.logger.info("UPDATING SUBSCRIPTION FACTURE");
                return updateSubscriptionFacture(data);
            }

            // Returning results.
            return {
                extra: undefined,
                error: true,
                code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
                msg: messagesCode[errorCodes.MISSING_REQUIRED_DATA_ERROR],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al generar petición de compra"
            );
        }
    }
);

export const getAccountUser = functions.https.onCall(getAccountUserLocal);
export const editAccountUser = functions.https.onCall(editAccountUserLocal);
