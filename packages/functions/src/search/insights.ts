import * as functions from "firebase-functions";
import aa, { InsightsEvent } from "search-insights";
import { ProductFactureData } from "../model/productTypes";
import { productIndex, productVendorIndex } from "./search";

// Connect and authenticate with your Algolia app
aa("init", {
    appId: process.env.SEARCH_ENGINE_APP_ID as string,
    apiKey: process.env.SEARCH_ENGINE_API_KEY as string,
});

export const sendBuyEvent = (
    token: string,
    vendorId: string,
    products: ProductFactureData[]
) => {
    try {
        const objectIDs: string[] = [];

        products.forEach((product) => {
            objectIDs.push(productIndex(product.id));
        });

        const events: InsightsEvent[] = [
            {
                authenticatedUserToken: token,
                eventType: "conversion",
                eventSubtype: "purchase",
                eventName: "Facture conversion",
                index: process.env.SEARCH_ENGINE_INDEX as string,
                objectIDs,
            },
            {
                authenticatedUserToken: token,
                eventType: "click",
                eventName: "Click product",
                index: process.env.SEARCH_ENGINE_INDEX as string,
                objectIDs,
            },
            {
                authenticatedUserToken: token,
                eventType: "view",
                eventName: "View product",
                index: process.env.SEARCH_ENGINE_INDEX as string,
                objectIDs,
            },
            {
                authenticatedUserToken: token,
                eventType: "click",
                eventName: "Click Vendor",
                index: process.env.SEARCH_ENGINE_INDEX as string,
                objectIDs: [productVendorIndex(vendorId)],
            },
            {
                authenticatedUserToken: token,
                eventType: "view",
                eventName: "View Vendor",
                index: process.env.SEARCH_ENGINE_INDEX as string,
                objectIDs: [productVendorIndex(vendorId)],
            },
        ];

        aa("sendEvents", events);
    } catch (err) {
        functions.logger.error(err);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "error editing index"
        );
    }
};
