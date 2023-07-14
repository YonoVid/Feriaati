import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";
import {
    ProductListData,
    ResponseData,
    VendorData,
} from "../model/reponseFields";
import { getAccount } from "./account";

export const getVendorList = async (
    token: string,
    userCollection: collectionNames,
    userError: errorCodes = errorCodes.USER_NOT_EXISTS_ERROR
): Promise<ResponseData<VendorData[]>> => {
    try {
        const { code: userCode } = await getAccount(userCollection, { token });
        if (userCode == errorCodes.SUCCESFULL) {
            const db = admin.firestore();
            const usersRef = db
                .collection(collectionNames.VENDORS)
                .where("isDeleted", "==", false);
            const querySnapshot = await usersRef.get();
            const vendors: VendorData[] = [];

            querySnapshot.forEach((doc) => {
                const userData = doc.data() as VendorData;
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
            code: userError,
            msg: messagesCode[userError],
            extra: [],
        };
    } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al obtener datos de los vendedores"
        );
    }
};

export const getProductVendorList = async (
    token: string,
    userCollection: collectionNames,
    userError: errorCodes = errorCodes.USER_NOT_EXISTS_ERROR
): Promise<ResponseData<ProductListData[]>> => {
    try {
        const { code: userCode } = await getAccount(userCollection, { token });
        if (userCode == errorCodes.SUCCESFULL) {
            const db = admin.firestore();
            const usersRef = db
                .collection(collectionNames.VENDORPRODUCTS)
                .where("isDeleted", "==", false);
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
            code: userError,
            msg: messagesCode[userError],
            extra: [],
        };
    } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al obtener datos de los vendedores"
        );
    }
};
