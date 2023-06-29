import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "../model/types";

import { checkAddProductFields, checkProductListFields } from "./checkProduct";
import { ProductData, ResponseData } from "../model/reponseFields";

import {
    ProductCollectionData,
    ProductListCollectionData,
} from "../model/productTypes";
import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";
import { uploadProductImage } from "../utilities/storage";
import { getAccount } from "../utilities/account";
import { VendorCollectionData } from "../model/accountTypes";

//funciones crud producto
export const addProduct = functions.https.onCall(
    async (data: ProductFields, context): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            if (data.discount === "none") {
                data.promotion = 0;
            }
            // Validar los datos recibidos y verificar la base de datos
            const { check, code } = checkAddProductFields(data);

            if (check) {
                const queryVendor = db
                    .collection(collectionNames.VENDORS)
                    .where("token", "==", data.tokenVendor);
                const vendor = await queryVendor.get();
                if (!vendor.empty) {
                    // Get product list reference
                    const productsRef = db.collection(
                        collectionNames.VENDORPRODUCTS
                    );

                    const products = await productsRef
                        .where("vendorId", "==", vendor.docs[0].id)
                        .get();
                    // Store document id
                    let id;
                    // Create new collection if not exists
                    if (products.empty) {
                        const vendorData =
                            (await vendor.docs[0].data()) as VendorCollectionData;
                        let collection: ProductListCollectionData = {
                            vendorId: vendor.docs[0].id,
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

                    const productRef = await productsRef
                        .doc(id)
                        .collection(collectionNames.PRODUCTS)
                        .doc();
                    // Store images data
                    let imageData: [string, string, string] = ["", "", ""];
                    if (typeof data.image === "string") {
                        imageData[0] = await uploadProductImage(
                            productRef.id + "_0",
                            data.image
                        );
                    } else {
                        imageData[0] = await uploadProductImage(
                            productRef.id + "_0",
                            data.image[0]
                        );
                        imageData[1] =
                            data.image[1] != ""
                                ? await uploadProductImage(
                                      productRef.id + "_1",
                                      data.image[1]
                                  )
                                : "";
                        imageData[2] =
                            data.image[2] != ""
                                ? await uploadProductImage(
                                      productRef.id + "_2",
                                      data.image[2]
                                  )
                                : "";
                    }

                    // Configurar los datos del producto
                    const productData: ProductCollectionData = {
                        name: data.name,
                        description: data.description,
                        // unit: ProductUnit.KILOGRAM,
                        price: data.price,
                        discount: data.discount,
                        promotion: data.promotion as number,
                        image: imageData,
                    };

                    await productRef.create(productData);

                    // Retornar el ID del producto creado
                    return {
                        extra: products.docs[0].id,
                        error: false,
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                    };
                } else {
                    return {
                        extra: "",
                        error: true,
                        code: errorCodes.USER_NOT_EXISTS_ERROR,
                        msg: messagesCode[errorCodes.USER_NOT_EXISTS_ERROR],
                    };
                }
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

export const deleteProduct = functions.https.onCall(
    async (
        data: ProductDeleteFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            const { productId } = data;

            const { doc, code } = await getAccount(collectionNames.VENDORS, {
                token: data.tokenVendor,
                id: data.idVendor,
            });

            if (doc.exists) {
                // Eliminar el producto de la base de datos
                const vendorProducts = (
                    await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .where("vendorId", "==", doc.id)
                        .get()
                ).docs[0];
                if (vendorProducts.exists) {
                    await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(vendorProducts.id)
                        .collection(collectionNames.PRODUCTS)
                        .doc(productId)
                        .delete();

                    // Retornar una respuesta indicando que el producto se eliminó correctamente
                    return {
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        code: errorCodes.SUCCESFULL,
                        error: false,
                        extra: productId,
                    };
                }
                return {
                    msg: messagesCode[errorCodes.DOCUMENT_NOT_EXISTS_ERROR],
                    code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                    error: true,
                };
            }

            return { msg: messagesCode[code], code, error: true };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al eliminar el producto."
            );
        }
    }
);

export const editProduct = functions.https.onCall(
    async (
        data: ProductEditFields,
        context: any
    ): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            // Validar los datos recibidos y verificar la base de datos
            const { check, code } = checkAddProductFields(data);

            if (check) {
                const { doc, code } = await getAccount(
                    collectionNames.VENDORS,
                    { token: data.tokenVendor }
                );
                if (doc.exists) {
                    // Obtener la referencia del producto a editar
                    const productVendorRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .where("vendorId", "==", doc.id)
                        .get();
                    const productVendorId = productVendorRef.docs[0].id || "";
                    const productRef = db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(productVendorId)
                        .collection(collectionNames.PRODUCTS)
                        .doc(data.id);

                    // Verificar si el producto existe
                    const productDoc = await productRef.get();
                    if (!productDoc.exists) {
                        return {
                            extra: "",
                            error: true,
                            code: errorCodes.DOCUMENT_NOT_EXISTS_ERROR,
                            msg: messagesCode[
                                errorCodes.DOCUMENT_NOT_EXISTS_ERROR
                            ],
                        };
                    }

                    // Store images data
                    let imageData: [string, string, string] = ["", "", ""];
                    if (typeof data.image === "string") {
                        imageData[0] =
                            data.image[0] != "" &&
                            !data.image[0].includes("https")
                                ? await uploadProductImage(
                                      productRef.id + "_0",
                                      data.image[0]
                                  )
                                : data.image[0];
                    } else {
                        imageData[0] =
                            data.image[0] != "" &&
                            !data.image[0].includes("https")
                                ? await uploadProductImage(
                                      productRef.id + "_0",
                                      data.image[0]
                                  )
                                : data.image[0];
                        imageData[1] =
                            data.image[1] != "" &&
                            !data.image[1].includes("https")
                                ? await uploadProductImage(
                                      productRef.id + "_1",
                                      data.image[1]
                                  )
                                : data.image[1];
                        imageData[2] =
                            data.image[2] != "" &&
                            !data.image[2].includes("https")
                                ? await uploadProductImage(
                                      productRef.id + "_2",
                                      data.image[2]
                                  )
                                : data.image[2];
                    }

                    // Configurar los datos actualizados del producto
                    const updatedProductData: Partial<ProductCollectionData> = {
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        discount: data.discount,
                        promotion: data.promotion as number,
                        image:
                            typeof data.image === "string"
                                ? [imageData[0], "", ""]
                                : imageData,
                    };

                    // Actualizar el producto en la base de datos
                    await productRef.update(updatedProductData);

                    // Retornar el ID del producto editado
                    return {
                        extra: data.id,
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

export const listProduct = functions.https.onCall(
    async (
        data: ProductListFields,
        context
    ): Promise<ResponseData<ProductData[]>> => {
        try {
            functions.logger.info("DATA::", data);
            const { check, code } = checkProductListFields(data);
            if (check) {
                const db = admin.firestore();
                let docReference;
                if (
                    data.idVendor &&
                    data.idVendor !== null &&
                    data.idVendor !== ""
                ) {
                    functions.logger.info("LIST FROM VENDOR ID");
                    docReference = await db
                        .collection(collectionNames.VENDORS)
                        .doc(data.idVendor as string)
                        .get();
                } else {
                    functions.logger.info("LIST FROM VENDOR TOKEN");
                    const queryVendor = db
                        .collection(collectionNames.VENDORS)
                        .where("token", "==", data.tokenVendor);
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
                        .collection(collectionNames.PRODUCTS)
                        .get();

                    const products: ProductData[] = [];

                    productsRef.forEach((doc) => {
                        const productData = doc.data() as ProductCollectionData;
                        products.push({ id: doc.id, ...productData });
                    });

                    return {
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        error: false,
                        extra: products,
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

export const getProductVendor = functions.https.onCall(
    async (
        data: ProductListFields,
        context
    ): Promise<ResponseData<ProductListCollectionData>> => {
        try {
            functions.logger.info("DATA::", data);
            const { check, code } = checkProductListFields(data);
            if (check) {
                const db = admin.firestore();
                let docReference;
                if (
                    data.idVendor &&
                    data.idVendor !== null &&
                    data.idVendor !== ""
                ) {
                    functions.logger.info("GET VENDOR BY ID");
                    docReference = await db
                        .collection(collectionNames.VENDORS)
                        .doc(data.idVendor as string)
                        .get();
                } else {
                    functions.logger.info("GET VENDOR BY TOKEN");
                    const queryVendor = db
                        .collection(collectionNames.VENDORS)
                        .where("token", "==", data.tokenVendor);
                    docReference = (await queryVendor.get()).docs[0];
                }

                functions.logger.info("VENDOR DOC::", docReference.id);

                if (docReference.exists) {
                    const vendorProductsRef = (
                        await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .where("vendorId", "==", docReference.id)
                            .get()
                    ).docs[0];

                    if (vendorProductsRef.exists) {
                        const productVendorDoc = await vendorProductsRef.data();

                        functions.logger.info(
                            "PRODUCT VENDOR DOC::",
                            productVendorDoc.id
                        );
                        functions.logger.info(
                            "PRODUCT VENDOR DOC P SIZE::",
                            productVendorDoc.product
                        );

                        return {
                            code: errorCodes.SUCCESFULL,
                            msg: messagesCode[errorCodes.SUCCESFULL],
                            error: false,
                            extra: productVendorDoc,
                        };
                    }
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

export const productListPagination = functions.https.onCall(
    async (data: any, context: any) => {
        try {
            const { page } = data; // obtiene numero de pagina actual
            const pageSize = 10; // cantidad de productos que se mostraran por cada pagina
            const db = admin.firestore();
            const usersRef = db.collection("product");
            // Calcula el índice de inicio y fin para la consulta de la página actual
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const querySnapshot = await usersRef.get();
            const product: any[] = [];
            let counter = 0;
            querySnapshot.forEach((doc: any) => {
                if (counter >= startIndex && counter < endIndex) {
                    const productData = doc.data();
                    product.push({ ...productData, id: doc.id });
                }
                counter++;
            });

            return { products: product, pageSize: pageSize };
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de productos"
            );
        }
    }
);

//funcion para filtrar productos

export const filterProductList = functions.https.onCall(
    async (data: any, context: any) => {
        try {
            const { productName } = data;
            const db = admin.firestore();
            const productsRef = db.collection("product");

            // Aplicar el filtro por nombre del producto
            const querySnapshot = await productsRef
                .where("name", "==", productName)
                .get();

            const product: any[] = [];

            querySnapshot.forEach((doc: any) => {
                const productData = doc.data();
                product.push({ ...productData, id: doc.id });
            });

            return product;
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de productos"
            );
        }
    }
);
