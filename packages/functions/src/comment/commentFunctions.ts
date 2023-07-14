import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    CommentCollectionData,
    CommentFields,
    GetCommentsFields,
    ReportCommentFields,
    UserComment,
} from "../model/commentTypes";
import { ResponseData } from "../model/reponseFields";
import {
    checkCommentFields,
    checkGetCommentsFields,
    checkReportCommentFields,
} from "./checkComment";
import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";
import { getAccount } from "../utilities/account";

export const getComments = functions.https.onCall(
    async (
        data: GetCommentsFields,
        context
    ): Promise<ResponseData<Array<UserComment>>> => {
        try {
            functions.logger.info("DATA::", data);
            const { check, code } = checkGetCommentsFields(data);
            if (check) {
                const db = admin.firestore();
                let vendorProductsRef;
                if (data.id && data.id !== null && data.id !== "") {
                    functions.logger.info("LIST FROM PRODUCT VENDOR ID");
                    vendorProductsRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(data.id as string)
                        .get();
                } else {
                    functions.logger.info("LIST FROM VENDOR TOKEN");
                    const queryVendor = db
                        .collection(collectionNames.VENDORS)
                        .where("token", "==", data.token);
                    let docReference = (await queryVendor.get()).docs[0];
                    functions.logger.info("VENDOR DOC::", docReference.id);

                    vendorProductsRef = (
                        await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .where("vendorId", "==", docReference.id)
                            .get()
                    ).docs[0];
                }

                functions.logger.info(
                    "PRODUCT VENDOR DOC::",
                    vendorProductsRef.id
                );

                if (vendorProductsRef && vendorProductsRef.exists) {
                    const productsRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(vendorProductsRef.id)
                        .collection(collectionNames.COMMENTPRODUCTS)
                        .get();

                    const comments: UserComment[] = [];

                    productsRef.forEach((doc) => {
                        const productData = doc.data() as CommentCollectionData;
                        comments.push({ id: doc.id, ...productData });
                    });

                    return {
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        error: false,
                        extra: comments,
                    };
                }
                return {
                    code: errorCodes.USER_NOT_EXISTS_ERROR,
                    msg: messagesCode[errorCodes.USER_NOT_EXISTS_ERROR],
                    error: true,
                    extra: [],
                };
            }
            return {
                code: code,
                msg: messagesCode[code],
                error: true,
                extra: [],
            };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de productos"
            );
        }
    }
);

export const addComment = functions.https.onCall(
    async (
        data: CommentFields,
        context
    ): Promise<ResponseData<UserComment>> => {
        try {
            const db = admin.firestore();
            // Validar los datos recibidos y verificar la base de datos
            const { check, code } = checkCommentFields(data);

            if (check) {
                const { code, doc: userDoc } = await getAccount(
                    collectionNames.USERS,
                    {
                        token: data.userToken,
                    }
                );
                if (code === errorCodes.SUCCESFULL) {
                    functions.logger.info("LIST FROM VENDOR ID");
                    const docVendorProduct = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(data.vendorId as string)
                        .get();

                    if (docVendorProduct.exists) {
                        const commentRef = await docVendorProduct.ref
                            .collection(collectionNames.COMMENTPRODUCTS)
                            .doc();

                        // Configurar los datos del producto
                        const commentData: CommentCollectionData = {
                            comment: data.comment,
                            username: await userDoc.get("username"),
                            userId: userDoc.id,
                            date: new Date(),
                        };

                        await commentRef.create(commentData);

                        // Retornar el ID del producto creado
                        return {
                            extra: { id: commentRef.id, ...commentData },
                            error: false,
                            code: errorCodes.SUCCESFULL,
                            msg: messagesCode[errorCodes.SUCCESFULL],
                        };
                    } else {
                        return {
                            extra: "",
                            error: true,
                            code: errorCodes.VENDOR_NOT_EXISTS_ERROR,
                            msg: messagesCode[
                                errorCodes.VENDOR_NOT_EXISTS_ERROR
                            ],
                        };
                    }
                }
                return {
                    extra: "",
                    error: true,
                    code: code,
                    msg: messagesCode[code],
                };
            }

            // Retornar los resultados
            return {
                extra: "",
                error: true,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);

export const reportComment = functions.https.onCall(
    async (data: ReportCommentFields): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            // Validar los datos recibidos y verificar la base de datos
            const { check, code } = checkReportCommentFields(data);

            if (check) {
                // Obtener la referencia del comentario a reportar
                const productVendorRef = await db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .doc(data.vendorId as string)
                    .get();
                const productVendorId = productVendorRef.id || "";

                const commentRef = db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .doc(productVendorId)
                    .collection(collectionNames.COMMENTPRODUCTS)
                    .doc(data.commentId as string);

                // Verificar si el comentario existe
                const commentDoc = await commentRef.get();
                if (!commentDoc.exists) {
                    return {
                        extra: "",
                        error: true,
                        code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                        msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                    };
                }

                const commentData = commentDoc.data() as CommentCollectionData;

                // Configurar los datos actualizados del producto
                const updatedProductData: Partial<CommentCollectionData> = {
                    ...commentData,
                    reports: commentData.reports ? commentData.reports + 1 : 1,
                };

                // Actualizar el comentario y usuario en la base de datos
                await commentRef.update(updatedProductData);

                const userDocRef = await db
                    .collection(collectionNames.USERS)
                    .doc(commentData.userId)
                    .get();
                const userReports = (await userDocRef.get("reports")) || 0;
                await db
                    .collection(collectionNames.USERS)
                    .doc(commentData.userId)
                    .update({ reports: userReports + 1 });

                // Retornar el ID del producto editado
                return {
                    extra: data.commentId,
                    error: false,
                    code: errorCodes.SUCCESFULL,
                    msg: messagesCode[errorCodes.SUCCESFULL],
                };
            }
            // Retornar los resultados
            return {
                extra: "",
                error: true,
                code: code,
                msg: messagesCode[code],
            };

            // Retornar los resultados
            return {
                extra: "",
                error: true,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);
