import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { DeleteFields, UpdateFullProductVendorFields } from "../model/types";
import { ResponseData } from "../model/reponseFields";

import { errorCodes, messagesCode } from "../errors";
import { collectionNames } from "../consts";
import { ProductListCollectionData } from "../model/productTypes";
import { checkProductVendorFullUpdate } from "../product/checkProduct";
import { uploadVendorProductImage } from "../utilities/storage";
import { getAccount } from "../utilities/account";

export const updateProductList = functions.https.onCall(
    async (
        data: UpdateFullProductVendorFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            functions.logger.info("DATA::", data);
            const { check, code } = checkProductVendorFullUpdate(data);

            if (check) {
                const adminAccount = await getAccount(collectionNames.ADMINS, {
                    token: data.adminToken,
                });
                if (adminAccount.code === errorCodes.SUCCESFULL) {
                    const db = admin.firestore();
                    const vendorProductsRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(data.id);
                    const docVendorProducts = await vendorProductsRef.get();
                    const isDeleted = docVendorProducts.get("isDeleted");
                    if (docVendorProducts.exists && !isDeleted) {
                        const imageUpdate =
                            data.image &&
                            data.image != null &&
                            data.image != "" &&
                            data.image.includes("data:image") &&
                            !data.image.includes("https")
                                ? await uploadVendorProductImage(
                                      docVendorProducts.id + "_0",
                                      data.image
                                  )
                                : data.image;

                        const updateData: Partial<ProductListCollectionData> = {
                            ...data,
                            image: imageUpdate,
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

export const deleteProductList = functions.https.onCall(
    async (data: DeleteFields, context): Promise<ResponseData<null>> => {
        try {
            const { token, itemId } = data;
            if (
                token != null &&
                token != "" &&
                itemId != null &&
                itemId != ""
            ) {
                const adminAccount = await getAccount(collectionNames.ADMINS, {
                    token: data.token,
                });
                if (adminAccount.code === errorCodes.SUCCESFULL) {
                    const db = admin.firestore();
                    const vendorProductsRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(data.itemId);
                    const docVendorProducts = await vendorProductsRef.get();
                    const isDeleted = docVendorProducts.get("isDeleted");
                    if (docVendorProducts.exists && !isDeleted) {
                        const updateData: Partial<ProductListCollectionData> = {
                            isDeleted: true,
                            userDelete: adminAccount.doc.id,
                            deletedDate: new Date(),
                        };
                        vendorProductsRef.update(updateData);
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
                };
            }

            return {
                error: true,
                code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
                msg: messagesCode[errorCodes.MISSING_REQUIRED_DATA_ERROR],
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
