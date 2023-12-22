import * as functions from "firebase-functions";
import {
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { collectionNames } from "../consts";
import {
    ProductCollectionData,
    ProductDiscount,
    ProductUnit,
} from "../model/productTypes";
import { IndexType, ProductIndex } from "../model/indexTypes";
import { deleteIndex, editIndex } from "./search";

const formatIndex = (
    id: string,
    vendorId: string,
    data: ProductCollectionData,
    active: boolean
): ProductIndex => {
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
        image: data.image[0],
        type: IndexType.PRODUCT,
        active: active,
    };

    return formatedData;
};

export const addProductIndex = onDocumentCreated(
    collectionNames.VENDORPRODUCTS +
        "/{productsDocument}/" +
        collectionNames.PRODUCTS +
        "/{document}",
    (event) => {
        const eventData: ProductCollectionData =
            event.data?.data() as ProductCollectionData;
        functions.logger.info("ADDING TO INDEX::", eventData);

        const data: ProductIndex = formatIndex(
            event.data?.id as string,
            event.params.productsDocument as string,
            eventData,
            true
        );

        return editIndex(data, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product ADD", err)
            );
    }
);

export const editProductIndex = onDocumentUpdated(
    collectionNames.VENDORPRODUCTS +
        "/{productsDocument}/" +
        collectionNames.PRODUCTS +
        "/{document}/",
    (event) => {
        const eventDataBefore: ProductCollectionData =
            event.data?.before.data() as ProductCollectionData;
        const eventDataAfter: ProductCollectionData =
            event.data?.after.data() as ProductCollectionData;
        functions.logger.info("EDITING INDEX::", eventDataAfter);

        const data = formatIndex(
            event.data?.after.id as string,
            event.params.productsDocument as string,
            {
                ...eventDataBefore,
                ...eventDataAfter,
            },
            true
        );

        return editIndex(data, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product ADD", err)
            );
    }
);

export const deleteProductIndex = onDocumentDeleted(
    collectionNames.VENDORPRODUCTS +
        "/{productsDocument}/" +
        collectionNames.PRODUCTS +
        "/{document}",
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
