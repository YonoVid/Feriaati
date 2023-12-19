import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import {
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { collectionNames, indexMaxInstances } from "../consts";
import {
    ProductCollectionData,
    ProductDiscount,
    ProductListCollectionData,
    ProductUnit,
} from "../model/productTypes";
import { IndexType, ProductIndex } from "../model/indexTypes";
import { deleteIndex, editIndex } from "./search";

const formatIndex = async (
    id: string,
    vendorId: string,
    data: ProductCollectionData,
    active: boolean
): Promise<ProductIndex> => {
    // Get vendor data
    const db = admin.firestore();
    const vendorProductsRef = await db
        .collection(collectionNames.VENDORPRODUCTS)
        .doc(vendorId);
    const docVendorProducts = await vendorProductsRef.get();
    const vendorData = docVendorProducts.data() as ProductListCollectionData;

    const discount: ProductDiscount = data.discount || ProductDiscount.NONE;
    const promotion: number = data.promotion || 0;

    const unitLabel =
        "(" +
        (data.unitType === ProductUnit.GRAM
            ? data.unit + "gr."
            : data.unitType === ProductUnit.KILOGRAM
              ? "kg."
              : "unidad") +
        ")";
    const finalPrice =
        data.price -
        (discount !== "none"
            ? discount === "percentage"
                ? (data.price * promotion) / 100
                : promotion
            : 0);

    const formatedData: ProductIndex = {
        objectID: "product-" + id,
        id: id,
        vendorId: vendorId,
        name: data.name + unitLabel,
        description: data.description,
        price: finalPrice,
        commune: vendorData.commune,
        region: vendorData.region,
        image: data.image[0],
        type: IndexType.PRODUCT,
        active: active,
    };

    return formatedData;
};

export const addProductIndex = onDocumentCreated(
    {
        document:
            collectionNames.VENDORPRODUCTS +
            "/{productsDocument}/" +
            collectionNames.PRODUCTS +
            "/{document}",
        maxInstances: indexMaxInstances,
    },
    (event) => {
        const eventData: ProductCollectionData =
            event.data?.data() as ProductCollectionData;
        functions.logger.info("ADDING TO INDEX::", eventData);

        formatIndex(
            event.data?.id as string,
            event.params.productsDocument as string,
            eventData,
            true
        )
            .then((value: ProductIndex) => {
                return editIndex(
                    value,
                    process.env.SEARCH_ENGINE_INDEX as string
                )
                    .then((res) =>
                        functions.logger.info(
                            "SUCCESS ALGOLIA product ADD",
                            res
                        )
                    )
                    .catch((err) =>
                        functions.logger.error("ERROR ALGOLIA product ADD", err)
                    );
            })
            .catch((err) => {
                functions.logger.error("ERROR ALGOLIA product ADD", err);
            });
    }
);

export const editProductIndex = onDocumentUpdated(
    {
        document:
            collectionNames.VENDORPRODUCTS +
            "/{productsDocument}/" +
            collectionNames.PRODUCTS +
            "/{document}/",
        maxInstances: indexMaxInstances,
    },
    (event) => {
        const eventDataBefore: ProductCollectionData =
            event.data?.before.data() as ProductCollectionData;
        const eventDataAfter: ProductCollectionData =
            event.data?.after.data() as ProductCollectionData;
        functions.logger.info("EDITING INDEX::", eventDataAfter);

        formatIndex(
            event.data?.after.id as string,
            event.params.productsDocument as string,
            {
                ...eventDataBefore,
                ...eventDataAfter,
            },
            true
        )
            .then((value: ProductIndex) => {
                return editIndex(
                    value,
                    process.env.SEARCH_ENGINE_INDEX as string
                )
                    .then((res) =>
                        functions.logger.info(
                            "SUCCESS ALGOLIA product ADD",
                            res
                        )
                    )
                    .catch((err) =>
                        functions.logger.error("ERROR ALGOLIA product ADD", err)
                    );
            })
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product ADD", err)
            );
    }
);

export const deleteProductIndex = onDocumentDeleted(
    {
        document:
            collectionNames.VENDORPRODUCTS +
            "/{productsDocument}/" +
            collectionNames.PRODUCTS +
            "/{document}",
        maxInstances: indexMaxInstances,
    },
    (event) => {
        const indexId = "product-" + event.data?.id;
        functions.logger.info("DELETE INDEX::", indexId);

        return deleteIndex(indexId, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product ADD", err)
            );
    }
);
