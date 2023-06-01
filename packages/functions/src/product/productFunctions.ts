import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  ProductAddFormProps,
  ProductFields,
  UpdateProductFields,
} from "../../../common/model/productAddFormProps";
import { checkAddProductFields } from "./checkProduct";
import { ResponseData } from "../model/types";
import { ProductCollectionData } from "../../../../packages/common/model/functionsTypes";

//funciones crud producto
export const addProduct = functions.https.onCall(
  async (data: ProductFields, context): Promise<ResponseData<string>> => {
    try {
      const db = admin.firestore();
      // Validar los datos recibidos y verificar la base de datos
      const { check, code } = checkAddProductFields(data);
      let error = false;

      if (check) {
        // Configurar los datos del producto
        const productData: ProductCollectionData = {
          name: data.name,
          description: data.description,
          price: data.price,
          isPercentage: data.isPercentage,
          promotion: data.promotion,
          image: data.image,
        };

        // Agregar el producto a la colección de productos
        const productRef = await db.collection("product").add(productData);

        // Retornar el ID del producto creado
        return {
          extra: productRef.id,
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
  async (data: UpdateProductFields, context): Promise<ResponseData<string>> => {
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
          isPercentage: data.isPercentage,
          promotion: data.promotion,
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

export const productList = functions.https.onCall(async () => {
  try {
    const db = admin.firestore();
    const usersRef = db.collection("product");
    const querySnapshot = await usersRef.get();
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
});

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
