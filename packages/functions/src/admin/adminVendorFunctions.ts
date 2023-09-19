import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    DeleteFields,
    UpdateFullVendorFields,
    UpdateStateFields,
} from "../model/types";
import { ResponseData, VendorData } from "../model/reponseFields";
import { userStatus, VendorCollectionData } from "../model/accountTypes";

import { errorCodes, messagesCode } from "../errors";
import { getAccount } from "../utilities/account";
import { collectionNames } from "../consts";
import { ProductListCollectionData } from "../model/productTypes";
import { getVendorList } from "../utilities/getList";
import { checkVendorFullUpdate } from "../vendor/checkVendor";

export const vendorList = functions.https.onCall(
    async (data: string): Promise<ResponseData<VendorData[]>> => {
        try {
            return await getVendorList(
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

export const registerVendorList = functions.https.onCall(
    async (data: string): Promise<ResponseData<VendorData[]>> => {
        try {
            const { code: adminCode } = await getAccount(
                collectionNames.ADMINS,
                { token: data }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const usersRef = await db
                    .collection(collectionNames.VENDORS)
                    .where("status", "==", userStatus.registered)
                    .get();
                const vendors: VendorData[] = [];
                functions.logger.info(
                    "REGISTERED VENDORS::",
                    usersRef.docs.length
                );

                usersRef.forEach((doc) => {
                    const userData = doc.data() as VendorData;
                    if (userData.status === userStatus.registered) {
                        vendors.push({ ...userData, id: doc.id });
                    }
                });

                return {
                    error: false,
                    code: errorCodes.SUCCESFULL,
                    msg: messagesCode[errorCodes.SUCCESFULL],
                    extra: vendors,
                };
            }
            return {
                error: true,
                code: errorCodes.ADMIN_NOT_EXISTS_ERROR,
                msg: messagesCode[errorCodes.ADMIN_NOT_EXISTS_ERROR],
                extra: [],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de los vendedores"
            );
        }
    }
);

export const vendorStateUpdate = functions.https.onCall(
    async (data: UpdateStateFields, context): Promise<ResponseData<null>> => {
        try {
            // obtiene id del usuario y el estado al que se desea alterar
            const { token, itemId, status } = data;

            const { code: adminCode, doc: adminDoc } = await getAccount(
                collectionNames.ADMINS,
                { token: token }
            );

            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const { code, doc: vendorDoc } = await getAccount(
                    collectionNames.VENDORS,
                    { id: itemId }
                );

                if (
                    code == errorCodes.SUCCESFULL &&
                    (status === userStatus.activated ||
                        status === userStatus.blocked)
                ) {
                    // Update vendor account state
                    await vendorDoc.ref.update({ status: status });

                    if (status === userStatus.activated) {
                        // Get product list reference
                        const productsId = (
                            vendorDoc.data() as VendorCollectionData
                        ).productsId;

                        const products = await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .where("vendorId", "==", productsId)
                            .get();

                        // Create new collection if not exists
                        if (products.empty) {
                            const vendorData =
                                (await vendorDoc.data()) as VendorCollectionData;
                            const collection: ProductListCollectionData = {
                                isDeleted: false,
                                enterpriseName: vendorData.enterpriseName,
                                localNumber: vendorData.localNumber,
                                rut: vendorData.rut,
                                street: vendorData.street,
                                streetNumber: vendorData.streetNumber,
                                region: vendorData.region,
                                commune: vendorData.commune,
                                image: vendorData.image,
                                updateDate: new Date(),
                                userUpdate: adminDoc.id,
                            };
                            await db
                                .collection(collectionNames.VENDORPRODUCTS)
                                .add(collection);
                        }
                    }
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

export const updateVendor = functions.https.onCall(
    async (
        data: UpdateFullVendorFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            functions.logger.info("DATA::", data);
            let { check, code } = checkVendorFullUpdate(data);

            if (check) {
                const adminAccount = await getAccount(collectionNames.ADMINS, {
                    token: data.adminToken,
                });
                if (adminAccount.code === errorCodes.SUCCESFULL) {
                    const db = admin.firestore();
                    const vendorProductsRef = await db
                        .collection(collectionNames.VENDORS)
                        .doc(data.id);
                    const docVendor = await vendorProductsRef.get();
                    const isDeleted = docVendor.get("isDeleted");
                    if (docVendor.exists && !isDeleted) {
                        const updateData: Partial<VendorCollectionData> = {
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

export const deleteVendor = functions.https.onCall(
    async (data: DeleteFields, context): Promise<ResponseData<null>> => {
        try {
            // Get call data
            const { token, itemId } = data;

            const { code: adminCode, doc: adminDoc } = await getAccount(
                collectionNames.ADMINS,
                { token: token }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const vendorRef = db.collection(collectionNames.VENDORS);
                const querySnapshot = await vendorRef.doc(itemId);
                const vendorDoc = await querySnapshot.get();

                if (
                    vendorDoc.exists &&
                    (status === userStatus.activated ||
                        status === userStatus.blocked)
                ) {
                    // Update vendor account state
                    await vendorRef.doc(itemId).update({
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
