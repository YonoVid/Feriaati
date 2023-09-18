import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { LoginFields, UpdateStateFields } from "../model/types";
import {
    ProductListData,
    ResponseData,
    UserToken,
    VendorData,
} from "../model/reponseFields";
import {
    userStatus,
    userType,
    VendorCollectionData,
} from "../model/accountTypes";

import { checkAccountFields } from "../utilities/checkAccount";
import { errorCodes, messagesCode } from "../errors";
import { accountLoginVerification, getAccount } from "../utilities/account";
import { collectionNames } from "../consts";
import { ProductListCollectionData } from "../model/productTypes";
import { getVendorList } from "../utilities/getList";

// ?REFERENCE FUNCTION
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const adminLogin = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData<UserToken>> => {
        try {
            const { email, password, attempts } = data;
            //Check fields format
            let { check, code } = checkAccountFields(data);

            if (check) {
                let { token, code } = await accountLoginVerification(
                    collectionNames.ADMINS,
                    email,
                    password,
                    attempts
                );
                return {
                    error: code !== errorCodes.SUCCESFULL,
                    code: code,
                    msg: messagesCode[code],
                    extra: {
                        token: token as string,
                        email: data.email,
                        type: userType.admin,
                    },
                };
            }
            // Returning results.
            return {
                error: true,
                code: code,
                msg: messagesCode[code],
                extra: { token: "", email: data.email },
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

export const vendorList = functions.https.onCall(
    async (data: string): Promise<ResponseData<any>> => {
        try {
            return getVendorList(
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

export const productVendorList = functions.https.onCall(
    async (data: string): Promise<ResponseData<ProductListData[]>> => {
        try {
            const { code: adminCode } = await getAccount(
                collectionNames.ADMINS,
                { token: data }
            );
            if (adminCode == errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const usersRef = db.collection(collectionNames.VENDORPRODUCTS);
                const querySnapshot = await usersRef.get();
                const vendors: ProductListData[] = [];

                querySnapshot.forEach((doc) => {
                    const userData = doc.data() as ProductListData;
                    vendors.push({ ...userData, id: doc.id });
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
