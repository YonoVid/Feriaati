import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UpdateFullUserFields, UpdateStateFields } from "../model/types";
import { ResponseData, UserData } from "../model/reponseFields";
import { UserCollectionData, userStatus } from "../model/accountTypes";

import { errorCodes, messagesCode } from "../errors";
import { getAccount } from "../utilities/account";
import { collectionNames } from "../consts";
import { getUserList } from "../utilities/getList";
import { checkUserFullUpdate } from "../buyer/checkBuyer";

export const userList = functions.https.onCall(
    async (data: string): Promise<ResponseData<UserData[]>> => {
        try {
            return await getUserList(
                data,
                collectionNames.ADMINS,
                errorCodes.ADMIN_NOT_EXISTS_ERROR
            );
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de los vendedores"
            );
        }
    }
);

export const userStateUpdate = functions.https.onCall(
    async (data: UpdateStateFields, context): Promise<ResponseData<null>> => {
        try {
            // obtiene id del usuario y el estado al que se desea alterar
            const { token, itemId, status } = data;

            const { code: adminCode } = await getAccount(
                collectionNames.ADMINS,
                { token: token }
            );

            if (adminCode == errorCodes.SUCCESFULL) {
                const { code, doc: userDoc } = await getAccount(
                    collectionNames.USERS,
                    { id: itemId }
                );

                if (
                    code == errorCodes.SUCCESFULL &&
                    (status === userStatus.activated ||
                        status === userStatus.blocked)
                ) {
                    // Update vendor account state
                    await userDoc.ref.update({ status: status });

                    return {
                        error: false,
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                    };
                }
                return {
                    error: true,
                    code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                    msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                };
            }
            return {
                error: true,
                code: errorCodes.ADMIN_NOT_EXISTS_ERROR,
                msg: messagesCode[errorCodes.ADMIN_NOT_EXISTS_ERROR],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al actualizar el estado del vendedor"
            );
        }
    }
);

export const updateUser = functions.https.onCall(
    async (
        data: UpdateFullUserFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            functions.logger.info("DATA::", data);
            const { check, code } = checkUserFullUpdate(data);

            if (check) {
                const adminAccount = await getAccount(collectionNames.ADMINS, {
                    token: data.adminToken,
                });
                if (adminAccount.code === errorCodes.SUCCESFULL) {
                    const db = admin.firestore();
                    const vendorProductsRef = await db
                        .collection(collectionNames.USERS)
                        .doc(data.id);
                    const docVendorProducts = await vendorProductsRef.get();
                    const isDeleted = docVendorProducts.get("isDeleted");
                    if (docVendorProducts.exists && !isDeleted) {
                        const updateData: Partial<UserCollectionData> = {
                            ...data,
                            updateDate: new Date(),
                            userUpdate: adminAccount.doc.id,
                        };

                        await vendorProductsRef.update(updateData);
                        return {
                            msg: messagesCode[errorCodes.SUCCESFULL],
                            code: errorCodes.SUCCESFULL,
                            error: false,
                            extra: vendorProductsRef.id,
                        };
                    }
                    return {
                        msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                        code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                        error: true,
                        extra: vendorProductsRef.id,
                    };
                }
                return {
                    msg: messagesCode[errorCodes.USER_NOT_EXISTS_ERROR],
                    code: errorCodes.USER_NOT_EXISTS_ERROR,
                    error: true,
                    extra: data.id,
                };
            }

            return {
                msg: messagesCode[code],
                code: code,
                error: true,
                extra: data.id,
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al actualizar el estado del vendedor"
            );
        }
    }
);

export const deleteUser = functions.https.onCall(
    async (data: UpdateStateFields, context): Promise<ResponseData<null>> => {
        try {
            // Get call data
            const { token, itemId, status } = data;

            const { code: adminCode, doc: adminDoc } = await getAccount(
                collectionNames.ADMINS,
                { token: token }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const userRef = db.collection(collectionNames.USERS);
                const querySnapshot = await userRef.doc(itemId);
                const userDoc = await querySnapshot.get();

                if (
                    userDoc.exists &&
                    (status === userStatus.activated ||
                        status === userStatus.blocked)
                ) {
                    // Update vendor account state
                    await userRef.doc(itemId).update({
                        status: status,
                        deleteDate: new Date(),
                        userDelete: adminDoc.id,
                    });

                    return {
                        error: false,
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                    };
                }
                return {
                    error: true,
                    code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                    msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                };
            }
            return {
                error: true,
                code: errorCodes.ADMIN_NOT_EXISTS_ERROR,
                msg: messagesCode[errorCodes.ADMIN_NOT_EXISTS_ERROR],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al actualizar el estado del vendedor"
            );
        }
    }
);
