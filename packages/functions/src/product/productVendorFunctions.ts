import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { ResponseData } from "../model/reponseFields";
import { UpdateProductVendorFields } from "../model/types";
import { ProductListCollectionData } from "../model/productTypes";

import { getAccount } from "../utilities/account";

import { collectionNames } from "../consts";
import { errorCodes, messagesCode } from "../errors";
import { checkProductVendorUpdate } from "./checkProduct";
import { uploadVendorProductImage } from "../utilities/storage";
import { VendorCollectionData } from "../model/accountTypes";

// Update local data
export const productVendorUpdate = functions.https.onCall(
    async (data: UpdateProductVendorFields): Promise<ResponseData<string>> => {
        functions.logger.info("DATA::", data);
        const { check, code } = checkProductVendorUpdate(data);

        if (check) {
            const { code, doc } = await getAccount(collectionNames.VENDORS, {
                token: data.token,
                email: data.email,
            });
            if (code === errorCodes.SUCCESFULL) {
                const db = admin.firestore();
                const vendorProductsRef = await db
                    .collection(collectionNames.VENDORPRODUCTS)
                    .doc((doc.data() as VendorCollectionData).productsId || "");
                const docVendorProducts = await vendorProductsRef.get();

                if (docVendorProducts.exists) {
                    const imageUpdate =
                        data.image &&
                        data.image != null &&
                        data.image != "" &&
                        data.image.includes("data:image") &&
                        !data.image.includes("http")
                            ? await uploadVendorProductImage(
                                  docVendorProducts.id + "_0",
                                  data.image
                              )
                            : data.image;

                    const updateData: Partial<ProductListCollectionData> = {
                        image: imageUpdate,
                        contact: {
                            phone: data.contactPhone
                                ? (data.contactPhone as string)
                                : "",
                            email: data.contactEmail
                                ? (data.contactEmail as string)
                                : "",
                        },
                        serviceTime: data.serviceTime,
                    };

                    await vendorProductsRef.update(updateData);
                    return {
                        msg: messagesCode[errorCodes.SUCCESFULL],
                        code: errorCodes.SUCCESFULL,
                        error: false,
                        extra: vendorProductsRef.id,
                    };
                }
                return {
                    msg: messagesCode[errorCodes.VENDOR_PERMISSION_ERROR],
                    code: errorCodes.VENDOR_PERMISSION_ERROR,
                    error: true,
                    extra: vendorProductsRef.id,
                };
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
                extra: data.productVendorId,
            };
        }

        return {
            msg: messagesCode[code],
            code: code,
            error: code !== errorCodes.SUCCESFULL,
            extra: data.productVendorId,
        };
    }
);
