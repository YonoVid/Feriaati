import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ResponseData } from "../model/reponseFields";
import {
    AccountCollectionData,
    ContributorCollectionData,
    ContributorLevel,
    userType,
} from "../model/accountTypes";
import { EditAccountFields } from "../model/types";

import { errorCodes, messagesCode } from "../errors";

import { editAccountUserLocal } from "./accountFunctions";
import { getAccount } from "../utilities/account";
import { collectionNames } from "../consts";

export const getAccountVendor = async (
    identificator: {
        id?: string;
        token?: string;
        email: string;
    },
    permission: ContributorLevel,
    createOnFail = false
): Promise<{ code: errorCodes; doc: admin.firestore.DocumentSnapshot }> => {
    try {
        const { id, token, email } = identificator;

        let { doc, code } = await getAccount(
            email.includes("@feriaati.cl")
                ? collectionNames.CONTRIBUTORS
                : collectionNames.VENDORS,
            {
                id,
                token,
                email,
            },
            createOnFail
        );

        if (code === errorCodes.SUCCESFULL) {
            const user = (await doc.data()) as ContributorCollectionData;
            if (user.type === userType.contributor) {
                switch (permission) {
                    case ContributorLevel.CASHIER:
                        if (
                            user.permissions !== permission &&
                            user.permissions !== ContributorLevel.MANAGER
                        ) {
                            code = errorCodes.CONTRIBUTOR_PERMISSION_ERROR;
                        }
                        break;
                    case ContributorLevel.VIEWER:
                        if (
                            user.permissions !== permission &&
                            user.permissions !== ContributorLevel.CASHIER &&
                            user.permissions !== ContributorLevel.MANAGER
                        ) {
                            code = errorCodes.CONTRIBUTOR_PERMISSION_ERROR;
                        }
                        break;

                    default:
                        if (user.permissions !== permission) {
                            code = errorCodes.CONTRIBUTOR_PERMISSION_ERROR;
                        }
                        break;
                }
            }
        }
        return {
            code: code,
            doc: doc,
        };
    } catch (err) {
        functions.logger.error(err);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "some message"
        );
    }
};

export const editAccountVendor = functions.https.onCall(
    async (
        data: EditAccountFields,
        context: any
    ): Promise<ResponseData<AccountCollectionData>> => {
        try {
            if (data.type === userType.contributor) {
                const userData = await editAccountUserLocal(data, context);

                const user = userData.extra as AccountCollectionData;

                if (user.type === userType.contributor) {
                    return {
                        code: errorCodes.UNEXPECTED_ERROR,
                        error: true,
                        msg: messagesCode[errorCodes.UNEXPECTED_ERROR],
                    };
                } else {
                    return userData;
                }
            } else {
                return editAccountUserLocal(data, context);
            }
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError(
                "invalid-argument",
                "some message"
            );
        }
    }
);
editAccountVendor;
