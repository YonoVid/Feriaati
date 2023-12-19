import * as functions from "firebase-functions";
import {
    onDocumentCreated,
    onDocumentUpdated,
    onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import { collectionNames, indexMaxInstances } from "../consts";
import { ProductListCollectionData } from "../model/productTypes";
import { IndexType, ProductVendorIndex } from "../model/indexTypes";
import { deleteIndex, editIndex, productVendorIndex } from "./search";
import { regionCode, regionCommune } from "../model/form";

const formatIndex = (
    id: string,
    data: ProductListCollectionData,
    active: boolean
): ProductVendorIndex => {
    const region = regionCode[data.region - 1];

    const commune = regionCommune[data.region].find(
        (el) => el[0] === data.commune
    );

    const location =
        data.street +
        " #" +
        data.streetNumber +
        " " +
        (data.region && region ? region[1] : "") +
        ", " +
        (data.region && data.commune && commune ? commune[1] : "");

    const rateCount =
        data.rating && data.rating != null
            ? data.rating.positive + data.rating.negative
            : 1;

    const rate =
        data.rating && data.rating != null
            ? data.rating.positive - data.rating.negative / rateCount
            : 0;

    const formatedData: ProductVendorIndex = {
        objectID: productVendorIndex(id),
        id: id,
        name: data.enterpriseName + " #" + data.localNumber,
        description: location,
        rate: rate,
        region: data.region,
        commune: data.commune,
        image: data.image,
        type: IndexType.PRODUCTVENDOR,
        active: active,
    };

    return formatedData;
};

export const addProductVendorIndex = onDocumentCreated(
    {
        document: collectionNames.VENDORPRODUCTS + "/{document}",
        maxInstances: indexMaxInstances,
    },
    (event) => {
        const eventData: ProductListCollectionData =
            event.data?.data() as ProductListCollectionData;
        functions.logger.info("ADDING TO INDEX::", eventData);

        const data: ProductVendorIndex = formatIndex(
            event.data?.id as string,
            eventData,
            !eventData.isDeleted
        );

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
    {
        document: collectionNames.VENDORPRODUCTS + "/{document}",
        maxInstances: indexMaxInstances,
    },
    (event) => {
        const eventDataBefore: ProductListCollectionData =
            event.data?.before.data() as ProductListCollectionData;
        const eventDataAfter: ProductListCollectionData =
            event.data?.after.data() as ProductListCollectionData;
        functions.logger.info("EDITING INDEX::", eventDataAfter);

        const data: ProductVendorIndex = formatIndex(
            event.data?.after.id as string,
            { ...eventDataBefore, ...eventDataAfter },
            !eventDataAfter.isDeleted
        );
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
    {
        document: collectionNames.VENDORPRODUCTS + "/{document}",
        maxInstances: indexMaxInstances,
    },
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
