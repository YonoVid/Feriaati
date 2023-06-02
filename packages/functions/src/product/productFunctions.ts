import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ProductFields, UpdateProductFields } from "../model/types";

import { checkAddProductFields } from "./checkProduct";
import { ResponseData } from "../model/reponseFields";
import {
  ProductCollectionData,
  ProductListCollectionData,
} from "../model/productTypes";
import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";

//funciones crud producto
export const addProduct = functions.https.onCall(
  async (data: ProductFields, context: any): Promise<ResponseData<string>> => {
    try {
      const db = admin.firestore();
      // Validar los datos recibidos y verificar la base de datos
      const { check, code } = checkAddProductFields(data);
      let error = false;

      if (check) {
        const queryVendor = db
          .collection(collectionNames.VENDORS)
          .where("token", "==", data.tokenVendor);
        const vendor = await queryVendor.get();
        if (!vendor.empty) {
          // Configurar los datos del producto
          const productData: ProductCollectionData = {
            name: data.name,
            description: data.description,
            price: data.price,
            discount: data.discount,
            promotion: data.promotion as number,
            image: data.image,
          };
          // Get product list reference
          const productsRef = db.collection(collectionNames.PRODUCTS);

          const products = await productsRef
            .where("vendor", "==", vendor.docs[0].id)
            .get();
          // Create new collection if not exists
          if (products.empty) {
            let collection: ProductListCollectionData = {
              vendorId: vendor.docs[0].id,
              products: [productData],
            };
            await productsRef.add(collection);
          } else {
            await productsRef.doc(products.docs[0].id).update({
              products: admin.firestore.FieldValue.arrayUnion(productData),
            });
          }

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
        error: error,
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
  async (data: any, context: any) => {
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
  }
);

export const updateProduct = functions.https.onCall(
  async (
    data: UpdateProductFields,
    context: any
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
          image: data.image,
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

export const productList = functions.https.onCall(
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
          if (doc.discount === "value") {
            doc.price = doc.price - doc.discount;
          } else if (doc.discount == "percentage") {
            doc.price = doc.price - doc.price * doc.discount;
          } else {
            doc.price = doc.price;
          }
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
