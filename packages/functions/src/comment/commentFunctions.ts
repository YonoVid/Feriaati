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
import { ProductListCollectionData } from "../model/productTypes";
import { getAccount } from "../utilities/account";
import { VendorCollectionData } from "../model/accountTypes";

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
                let docReference;
                if (data.id && data.id !== null && data.id !== "") {
                    functions.logger.info("LIST FROM VENDOR ID");
                    docReference = await db
                        .collection(collectionNames.VENDORS)
                        .doc(data.id as string)
                        .get();
                } else {
                    functions.logger.info("LIST FROM VENDOR TOKEN");
                    const queryVendor = db
                        .collection(collectionNames.VENDORS)
                        .where("token", "==", data.token);
                    docReference = (await queryVendor.get()).docs[0];
                }

                functions.logger.info("VENDOR DOC::", docReference);

                if (docReference.exists) {
                    const vendorProductsRef = (
                        await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .where("vendorId", "==", docReference.id)
                            .get()
                    ).docs[0];

                    functions.logger.info("VENDOR PRODUCTS DOC", docReference);

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
                        .collection(collectionNames.VENDORS)
                        .doc(data.vendorId as string)
                        .get();

                    if (docVendorProduct.exists) {
                        // Get product list reference
                        const productsRef = db.collection(
                            collectionNames.VENDORPRODUCTS
                        );

                        const products = await productsRef
                            .where("vendorId", "==", docVendorProduct.id)
                            .get();
                        // Store document id
                        let id;
                        // Create new collection if not exists
                        if (products.empty) {
                            const vendorData =
                                docVendorProduct.data() as VendorCollectionData;
                            let collection: ProductListCollectionData = {
                                vendorId: docVendorProduct.id,
                                enterpriseName: vendorData.enterpriseName,
                                localNumber: vendorData.localNumber,
                                rut: vendorData.rut,
                                street: vendorData.street,
                                streetNumber: vendorData.streetNumber,
                                region: vendorData.region,
                                commune: vendorData.commune,
                                image: vendorData.image,
                            };
                            id = (await productsRef.add(collection)).id;
                        } else {
                            id = products.docs[0].id;
                        }

                        const commentRef = await productsRef
                            .doc(id)
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
                // Obtener la referencia del producto a editar
                const productVendorRef = await db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .where("vendorId", "==", data.vendorId)
                    .get();
                const productVendorId = productVendorRef.docs[0].id || "";

                const commentRef = db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .doc(productVendorId)
                    .collection(collectionNames.COMMENTPRODUCTS)
                    .doc(data.commentId as string);

                // Verificar si el producto existe
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

                // Actualizar el producto en la base de datos
                await commentRef.update(updatedProductData);

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
