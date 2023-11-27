import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "../model/types";

import { checkAddProductFields, checkProductListFields } from "./checkProduct";
import {
    ProductData,
    ProductListData,
    ResponseData,
} from "../model/reponseFields";

import { ProductCollectionData } from "../model/productTypes";
import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";
import { uploadProductImage } from "../utilities/storage";
import { getAccount } from "../utilities/account";
import { ContributorLevel, VendorCollectionData } from "../model/accountTypes";
import { getAccountVendor } from "../account/accountVendorFunctions";

// Add product function
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
                const { code, doc: vendorDoc } = await getAccount(
                    collectionNames.VENDORS,
                    { token: data.tokenVendor }
                );

                if (code == errorCodes.SUCCESFULL) {
                    const vendorData: VendorCollectionData =
                        vendorDoc.data() as VendorCollectionData;

                    // Get product list reference
                    const productsRef = db.collection(
                        collectionNames.VENDORPRODUCTS
                    );
                    // Store document id
                    const productVendorRef = await productsRef
                        .doc(vendorData.productsId as string)
                        .get();

                    const productRef = await productVendorRef.ref
                        .collection(collectionNames.PRODUCTS)
                        .doc();
                    // Store images data
                    const imageData: [string, string, string] = ["", "", ""];
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
                        unit: data.unit,
                        unitType: data.unitType,
                        price: data.price,
                        discount: data.discount,
                        promotion: data.promotion as number,
                        image: imageData,
                    };

                    await productRef.create(productData);

                    // Retornar el ID del producto creado
                    return {
                        extra: productRef.id,
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
            const { idProducts } = data;

            const { doc, code } = await getAccount(collectionNames.VENDORS, {
                token: data.token,
                id: data.idProducts,
            });

            if (doc.exists) {
                const vendorData: VendorCollectionData =
                    doc.data() as VendorCollectionData;
                // Eliminar el producto de la base de datos
                const vendorProducts = await db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .doc(vendorData.productsId as string)
                    .get();

                if (vendorProducts.exists) {
                    await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(vendorProducts.id)
                        .collection(collectionNames.PRODUCTS)
                        .doc(idProducts)
                        .delete();

                    // Retornar una respuesta indicando que el producto se eliminó correctamente
                    return {
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        code: errorCodes.SUCCESFULL,
                        error: false,
                        extra: idProducts,
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
                    const vendorData: VendorCollectionData =
                        doc.data() as VendorCollectionData;

                    // Obtener la referencia del producto a editar
                    const productVendorRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(vendorData.productsId as string)
                        .get();

                    const productRef = db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(productVendorRef.id)
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
                    const imageData: [string, string, string] = ["", "", ""];
                    if (typeof data.image === "string") {
                        imageData[0] =
                            data.image[0] != undefined &&
                            data.image[0] != null &&
                            data.image[0] != "" &&
                            !data.image[0].includes("http")
                                ? await uploadProductImage(
                                      productRef.id + "_0",
                                      data.image[0]
                                  )
                                : data.image[0];
                    } else {
                        imageData[0] =
                            data.image[0] != undefined &&
                            data.image[0] != null &&
                            data.image[0] != "" &&
                            !data.image[0].includes("http")
                                ? await uploadProductImage(
                                      productRef.id + "_0",
                                      data.image[0]
                                  )
                                : data.image[0];
                        imageData[1] =
                            data.image[1] != undefined &&
                            data.image[1] != null &&
                            data.image[1] != "" &&
                            !data.image[1].includes("http")
                                ? await uploadProductImage(
                                      productRef.id + "_1",
                                      data.image[1]
                                  )
                                : data.image[1];
                        imageData[2] =
                            data.image[2] != undefined &&
                            data.image[2] != null &&
                            data.image[2] != "" &&
                            !data.image[2].includes("http")
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
                        unitType: data.unitType,
                        unit: data.unit,
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
            let { check, code } = checkProductListFields(data);
            if (check) {
                const { idProducts, token, id, email } = data;
                const db = admin.firestore();
                let vendorProductRef;
                if (idProducts && idProducts !== null && idProducts !== "") {
                    functions.logger.info("LIST FROM VENDOR ID");
                    const { code: idCode, doc } = await getAccount(
                        collectionNames.VENDORPRODUCTS,
                        { id: idProducts }
                    );
                    vendorProductRef = doc;
                    code = idCode;
                } else {
                    functions.logger.info("LIST FROM VENDOR TOKEN");

                    const { code: codeToken, doc: docVendor } =
                        await getAccountVendor(
                            { id, token, email },
                            ContributorLevel.VIEWER
                        );

                    if (codeToken === errorCodes.SUCCESFULL) {
                        const vendorData: VendorCollectionData =
                            docVendor.data() as VendorCollectionData;

                        vendorProductRef = await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .doc(vendorData.productsId as string)
                            .get();
                    }
                    code = codeToken;
                }

                if (vendorProductRef && vendorProductRef.exists) {
                    functions.logger.info(
                        "VENDOR PRODUCTS DOC::",
                        vendorProductRef.id
                    );
                    const productsRef = await db
                        .collection(collectionNames.VENDORPRODUCTS)
                        .doc(vendorProductRef.id)
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
    ): Promise<ResponseData<ProductListData>> => {
        try {
            const { id, token, email, idProducts } = data;

            functions.logger.info("DATA::", data);
            let { check, code } = checkProductListFields(data);
            if (check) {
                const db = admin.firestore();
                let vendorProductsRef;
                if (idProducts && idProducts !== null && idProducts !== "") {
                    const { code: codeId, doc: docId } = await getAccount(
                        collectionNames.VENDORPRODUCTS,
                        { id: idProducts }
                    );

                    code = codeId;
                    vendorProductsRef = docId;
                } else {
                    functions.logger.info("GET VENDOR BY TOKEN");
                    const { code: codeToken, doc: docToken } =
                        await getAccountVendor(
                            { id, token, email },
                            ContributorLevel.VIEWER
                        );

                    if (codeToken === errorCodes.SUCCESFULL) {
                        const vendorData: VendorCollectionData =
                            docToken.data() as VendorCollectionData;

                        vendorProductsRef = await db
                            .collection(collectionNames.VENDORPRODUCTS)
                            .doc(vendorData.productsId as string)
                            .get();
                    }
                    code = codeToken;
                }

                if (vendorProductsRef && vendorProductsRef.exists) {
                    functions.logger.info(
                        "PRODUCT VENDOR DOC::",
                        vendorProductsRef.id
                    );
                    const productVendorDoc = vendorProductsRef.data();

                    functions.logger.info(
                        "PRODUCT VENDOR DOC P SIZE::",
                        productVendorDoc ? productVendorDoc.product : "null"
                    );

                    return {
                        code: errorCodes.SUCCESFULL,
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        error: false,
                        extra: {
                            ...productVendorDoc,
                            id: vendorProductsRef.id,
                        },
                    };
                }
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

// funcion para filtrar productos

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
