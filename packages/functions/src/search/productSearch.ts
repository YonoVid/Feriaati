import * as functions from "firebase-functions";
import {
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { collectionNames } from "../consts";
import { ProductCollectionData } from "../model/productTypes";
import { ProductIndex } from "../model/indexTypes";
import { deleteIndex, editIndex } from "./search";

export const addProductIndex = onDocumentCreated(
    collectionNames.VENDORPRODUCTS +
        "/{productsDocument}/" +
        collectionNames.PRODUCTS +
        "/{document}",
    (event) => {
        const eventData: ProductCollectionData =
            event.data?.data() as ProductCollectionData;
        functions.logger.info("ADDING TO INDEX::", eventData);

        const data: ProductIndex = {
            objectID: "product-" + event.data?.id,
            name: eventData.name,
            description: eventData.description,
            unitType: eventData.unitType,
            unit: eventData.unit,
            price: eventData.price,
            discount: eventData.discount,
            promotion: eventData.promotion,
            image: eventData.image,
        };
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

        const data: ProductIndex = {
            objectID: "product-" + event.data?.before.id,
            name: eventDataAfter.name || eventDataBefore.name,
            description:
                eventDataAfter.description || eventDataBefore.description,
            unitType: eventDataAfter.unitType || eventDataBefore.unitType,
            unit: eventDataAfter.unit || eventDataBefore.unit,
            price: eventDataAfter.price || eventDataBefore.price,
            discount: eventDataAfter.discount || eventDataBefore.discount,
            promotion: eventDataAfter.promotion || eventDataBefore.promotion,
            image: eventDataAfter.image || eventDataBefore.image,
        };
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
