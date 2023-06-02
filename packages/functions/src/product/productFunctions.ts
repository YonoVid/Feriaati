import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    ProductFields,
    ProductListFields,
    UpdateProductFields,
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

//funciones crud producto
export const addProduct = functions.https.onCall(
    async (data: ProductFields, context): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
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
                        let collection: ProductListCollectionData = {
                            vendorId: vendor.docs[0].id,
                        };
                        id = (await productsRef.add(collection)).id;
                    } else {
                        id = products.docs[0].id;
                    }
                    // Store images data
                    let imageData: [string, string, string] = ["", "", ""];
                    if (typeof data.image === "string") {
                        imageData[0] = await uploadProductImage(id, data.image);
                    } else {
                        imageData[0] = await uploadProductImage(
                            id,
                            data.image[0]
                        );
                        imageData[1] =
                            data.image[1] != ""
                                ? await uploadProductImage(id, data.image[1])
                                : "";
                        imageData[2] =
                            data.image[2] != ""
                                ? await uploadProductImage(id, data.image[2])
                                : "";
                    }

                    // Configurar los datos del producto
                    const productData: ProductCollectionData = {
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        discount: data.discount,
                        promotion: data.promotion as number,
                        image: imageData,
                    };

                    await productsRef
                        .doc(id)
                        .collection(collectionNames.PRODUCTS)
                        .add(productData);

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

export const deleteProduct = functions.https.onCall(async (data, context) => {
    try {
        const db = admin.firestore();
        const { productId } = data;

        // Eliminar el producto de la base de datos
        await db.collection("product").doc(productId).delete();

        // Retornar una respuesta indicando que el producto se eliminó correctamente
        return { message: "Producto eliminado correctamente" };
    } catch (error) {
        functions.logger.error(error);
        throw new functions.https.HttpsError(
            "internal",
            "Error al eliminar el producto."
        );
    }
});

export const updateProduct = functions.https.onCall(
    async (
        data: UpdateProductFields,
        context
    ): Promise<ResponseData<string>> => {
        try {
            const db = admin.firestore();
            // Validar los datos recibidos y verificar la base de datos
            const { check, code } = checkAddProductFields(data);
            let error = false;

            if (check) {
                // Obtener la referencia del producto a editar
                const productRef = db.collection("product").doc(data.productId);

                // Verificar si el producto existe
                const productDoc = await productRef.get();
                if (!productDoc.exists) {
                    error = true;
                    return {
                        extra: "",
                        error: error,
                        code: "",
                        msg: "",
                    };
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
                            ? [data.image, "", ""]
                            : data.image,
                };

                // Actualizar el producto en la base de datos
                await productRef.update(updatedProductData);

                // Retornar el ID del producto editado
                return {
                    extra: data.productId,
                    error: error,
                    code: code,
                    msg: "",
                };
            } else {
                error = true;
            }

            // Retornar los resultados
            return {
                extra: "",
                error: error,
                code: code,
                msg: "",
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
                if (data.idVendor !== null && data.idVendor !== "") {
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

//funcion para filtrar productos
export const filterProductList = functions.https.onCall(
    async (data: any, context) => {
        try {
            const { productName } = data;
            const db = admin.firestore();
            const productsRef = db.collection("product");

            // Aplicar el filtro por nombre del producto
            const querySnapshot = await productsRef
                .where("name", "==", productName)
                .get();

            const product: any[] = [];

            querySnapshot.forEach((doc) => {
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
