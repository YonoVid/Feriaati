import * as functions from "firebase-functions";
import * as algoliasearch from "algoliasearch";

// Connect and authenticate with your Algolia app
const client = algoliasearch.default(
    process.env.SEARCH_ENGINE_APP_ID as string,
    process.env.SEARCH_ENGINE_API_KEY as string
);

export const productIndex = (id: string) => "product-" + id;
export const productVendorIndex = (id: string) => "productVendor-" + id;

export const editIndex = (data: any, indexName: string): Promise<unknown> => {
    try {
        // Create a new index and add a record
        const index = client.initIndex(indexName);

        return new Promise((resolve, reject) => {
            index
                .saveObject(data)
                .then((res) => {
                    console.log("res GOOD", res);
                    resolve(res);
                })
                .catch((err) => {
                    console.log("err BAD", err);
                    reject(err);
                });
        });
    } catch (err) {
        functions.logger.error(err);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "error editing index"
        );
    }
};

export const deleteIndex = (
    data: string,
    indexName: string
): Promise<unknown> => {
    try {
        // Create a new index and add a record
        const index = client.initIndex(indexName);

        return new Promise((resolve, reject) => {
            index
                .deleteObject(data)
                .then((res) => {
                    console.log("res GOOD", res);
                    resolve(res);
                })
                .catch((err) => {
                    console.log("err BAD", err);
                    reject(err);
                });
        });
    } catch (err) {
        functions.logger.error(err);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "error creating index"
        );
    }
};
