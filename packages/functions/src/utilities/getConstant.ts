import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { errorCodes } from "../errors";
import { collectionNames, constantNames } from "../consts";

export const getConstant = async (
    constant: constantNames
): Promise<{ code: errorCodes; doc: admin.firestore.DocumentSnapshot }> => {
    const db = admin.firestore();
    const constantReference = await db
        .collection(collectionNames.CONSTANTS)
        .doc(constant)
        .get();

    functions.logger.info("GET CONSTANT::", constant);

    return {
        doc: constantReference,
        code:
            !constantReference || !constantReference.exists
                ? errorCodes.DOCUMENT_NOT_EXISTS_ERROR
                : errorCodes.SUCCESFULL,
    };
};
