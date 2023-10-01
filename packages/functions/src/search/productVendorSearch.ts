import * as functions from "firebase-functions";
import {
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { collectionNames } from "../consts";
import { ProductListCollectionData } from "../model/productTypes";
import { ProductVendorIndex } from "../model/indexTypes";
import { deleteIndex, editIndex } from "./search";

export const addProductVendorIndex = onDocumentCreated(
    collectionNames.VENDORPRODUCTS + "/{document}",
    (event) => {
        const eventData: ProductListCollectionData =
            event.data?.data() as ProductListCollectionData;
        functions.logger.info("ADDING TO INDEX::", eventData);

        const data: ProductVendorIndex = {
            objectID: "productVendor-" + event.data?.id,
            active: !eventData.isDeleted,
            rating: eventData.rating,
            enterpriseName: eventData.enterpriseName,
            rut: eventData.rut,
            localNumber: eventData.localNumber,
            region: eventData.region,
            commune: eventData.commune,
            street: eventData.street,
            streetNumber: eventData.streetNumber,
            image: eventData.image,
            serviceTime: eventData.serviceTime,
            contact: eventData.contact,
        };
        return editIndex(data, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product list ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product list ADD", err)
            );
    }
);

export const editProductVendorIndex = onDocumentUpdated(
    collectionNames.VENDORPRODUCTS + "/{document}",
    (event) => {
        const eventDataBefore: ProductListCollectionData =
            event.data?.before.data() as ProductListCollectionData;
        const eventDataAfter: ProductListCollectionData =
            event.data?.after.data() as ProductListCollectionData;
        functions.logger.info("EDITING INDEX::", eventDataAfter);

        const data: ProductVendorIndex = {
            objectID: "productVendor-" + event.data?.after.id,
            active: !eventDataAfter.isDeleted || eventDataBefore.isDeleted,
            rating: eventDataAfter.rating || eventDataBefore.rating,
            enterpriseName:
                eventDataAfter.enterpriseName || eventDataBefore.enterpriseName,
            rut: eventDataAfter.rut || eventDataBefore.rut,
            localNumber:
                eventDataAfter.localNumber || eventDataBefore.localNumber,
            region: eventDataAfter.region || eventDataBefore.region,
            commune: eventDataAfter.commune || eventDataBefore.commune,
            street: eventDataAfter.street || eventDataBefore.street,
            streetNumber:
                eventDataAfter.streetNumber || eventDataBefore.streetNumber,
            image: eventDataAfter.image || eventDataBefore.image,
            serviceTime:
                eventDataAfter.serviceTime || eventDataBefore.serviceTime,
            contact: eventDataAfter.contact || eventDataBefore.contact,
        };
        return editIndex(data, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product list ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product list ADD", err)
            );
    }
);

export const deleteProductVendorIndex = onDocumentDeleted(
    collectionNames.VENDORPRODUCTS + "/{document}",
    (event) => {
        const indexId = "productVendor-" + event.data?.id;
        functions.logger.info("DELETE INDEX::", indexId);

        return deleteIndex(indexId, process.env.SEARCH_ENGINE_INDEX as string)
            .then((res) =>
                functions.logger.info("SUCCESS ALGOLIA product list ADD", res)
            )
            .catch((err) =>
                functions.logger.error("ERROR ALGOLIA product list ADD", err)
            );
    }
);
