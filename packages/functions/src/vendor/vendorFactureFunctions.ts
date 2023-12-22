import * as functions from "firebase-functions";
import { FactureFields, ResumeFields } from "../model/types";
import { ResponseData } from "../model/reponseFields";
import { errorCodes, messagesCode } from "../errors";

import { getAccount } from "../utilities/account";

import { collectionNames } from "../consts";
import {
    FactureData,
    FactureStatus,
    ProductFactureData,
} from "../model/productTypes";
import {
    checkFactureFields,
    checkResumeFields,
} from "../utilities/checkFacture";
import {
    UserFactureCollectionStoredData,
    VendorProductData,
    YearFactureResumeCollection,
} from "../model/transactionTypes";
import { ContributorLevel, VendorCollectionData } from "../model/accountTypes";
import { getAccountVendor } from "../account/accountVendorFunctions";
/**
 * Function to log in user in the platform requires data of type LoginFields
 * @typeparam LoginFields - is the data from a login form
 */
export const getVendorFactures = functions.https.onCall(
    async (
        data: FactureFields,
        context
    ): Promise<ResponseData<Array<FactureData>>> => {
        try {
            let { code, check } = checkFactureFields(data);

            if (check) {
                const { doc: docVendor, code: vendorCode } =
                    await getAccountVendor(
                        {
                            token: data.token,
                            email: data.email,
                        },
                        ContributorLevel.VIEWER
                    );
                if (vendorCode == errorCodes.SUCCESFULL) {
                    const { doc, code: productsCode } = await getAccount(
                        collectionNames.VENDORPRODUCTS,
                        {
                            id: (docVendor.data() as VendorCollectionData)
                                .productsId,
                        }
                    );
                    if (productsCode == errorCodes.SUCCESFULL) {
                        const factures: Array<FactureData> = [];

                        const factureSize = (
                            await doc.ref
                                .collection(collectionNames.FACTURES)
                                .count()
                                .get()
                        ).data().count;

                        if (factureSize - 1 >= data.index) {
                            const quantity = Math.min(
                                data.size,
                                factureSize - data.index + 1
                            );

                            const facturesDocs = await doc.ref
                                .collection(collectionNames.FACTURES)
                                .orderBy("date")
                                .startAt(data.index)
                                .limit(quantity)
                                .get();
                            facturesDocs.docs.forEach((doc) => {
                                const data =
                                    doc.data() as UserFactureCollectionStoredData;
                                let products: Array<ProductFactureData> = [];
                                Object.keys(data.products).forEach((key) => {
                                    products = products.concat(
                                        data.products[key]
                                    );
                                });

                                const newData: FactureData = {
                                    id: doc.id,
                                    status: data.status,
                                    date: {
                                        seconds: data.date.seconds,
                                        nanoseconds: data.date.nanoseconds,
                                    },
                                    products: products,
                                    originalFacture: data.factureId || "",
                                };
                                functions.logger.info(newData);

                                factures.push(newData);
                            });
                            return {
                                error: code != errorCodes.SUCCESFULL,
                                code: code,
                                msg: messagesCode[code],
                                extra: factures,
                            };
                        } else {
                            code = errorCodes.DOCUMENT_NOT_EXISTS_ERROR;
                        }
                    } else {
                        code = productsCode;
                    }
                } else {
                    code = vendorCode;
                }
            }
            return {
                error: true,
                msg: messagesCode[code],
                code: code,
                extra: {},
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError(
                "invalid-argument",
                "some message"
            );
        }
    }
);

/**
 * Function to get resume of vendor factures from a year
 * @typeparam ResumeFields - is the data from a user petition and year
 */
export const getResume = functions.https.onCall(
    async (
        data: ResumeFields,
        context
    ): Promise<ResponseData<Array<YearFactureResumeCollection>>> => {
        try {
            let { code, check } = checkResumeFields(data);

            if (check) {
                const { doc: docVendor, code: vendorCode } =
                    await getAccountVendor(
                        {
                            token: data.token,
                            email: data.email,
                        },
                        ContributorLevel.VIEWER
                    );
                if (vendorCode == errorCodes.SUCCESFULL) {
                    const { doc, code: productsCode } = await getAccount(
                        collectionNames.VENDORPRODUCTS,
                        {
                            id: (docVendor.data() as VendorCollectionData)
                                .productsId,
                        }
                    );
                    if (productsCode == errorCodes.SUCCESFULL) {
                        const resumeDoc = await doc.ref
                            .collection(collectionNames.RESUME)
                            .where("year", "==", data.year)
                            .get();

                        if (resumeDoc.docs.length > 0) {
                            return {
                                error: false,
                                msg: messagesCode[errorCodes.SUCCESFULL],
                                code: errorCodes.SUCCESFULL,
                                extra: resumeDoc.docs[0].data() as YearFactureResumeCollection,
                            };
                        }

                        code = errorCodes.DOCUMENT_NOT_EXISTS_ERROR;
                    } else {
                        code = productsCode;
                    }
                } else {
                    code = vendorCode;
                }
            }

            return {
                error: true,
                msg: messagesCode[code],
                code: code,
                extra: {},
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError(
                "invalid-argument",
                "some message"
            );
        }
    }
);

export const registerFactureData = async (
    data: VendorProductData
): Promise<boolean> => {
    try {
        const { code, doc } = await getAccount(collectionNames.VENDORPRODUCTS, {
            id: data.id,
        });
        if (code === errorCodes.SUCCESFULL) {
            const petitionData: FactureData = {
                id: doc.id,
                status: FactureStatus.PROCESSING,
                date: {
                    seconds: data.time.seconds,
                    nanoseconds: data.time.nanoseconds,
                },
                products: data.products,
                originalFacture: data.docId,
            };
            const newDoc = doc.ref.collection(collectionNames.FACTURES).doc();

            await newDoc.create(petitionData);

            const date = data.time.toDate();

            const yearData = await doc.ref
                .collection(collectionNames.RESUME)
                .orderBy("year")
                .where("year", "==", date.getFullYear())
                .get();

            let newData: YearFactureResumeCollection = {
                day: {
                    [date.getDate()]: {
                        transactions: 1,
                        totalIncome: 1,
                        products: {},
                    },
                },
                month: {
                    [date.getMonth()]: {
                        transactions: 1,
                        totalIncome: 1,
                        products: {},
                    },
                },
                year: date.getFullYear(),
                transactions: 1,
                totalIncome: 0,
                lastUpdate: date,
            };

            if (yearData.docs.length > 0) {
                const storedData =
                    yearData.docs[0].data() as YearFactureResumeCollection;

                newData = {
                    day: { ...newData.day, ...storedData.day },
                    month: { ...newData.month, ...storedData.month },
                    year: newData.year,
                    transactions: storedData.transactions + 1,
                    totalIncome: storedData.totalIncome,
                    lastUpdate: storedData.lastUpdate,
                };
            }

            for (const key in data.products) {
                if (key) {
                    const product = data.products[key];
                    const dateData = newData.day[date.getDate()];
                    if (
                        dateData !== undefined &&
                        dateData.products[key] !== undefined &&
                        newData.lastUpdate.getDate() <= date.getDate()
                    ) {
                        newData.day[date.getDate()].products[key] = {
                            name: dateData.products[key].name,
                            quantity:
                                product.quantity +
                                dateData.products[key].quantity,
                            subtotal:
                                product.subtotal +
                                dateData.products[key].subtotal,
                        };
                    } else {
                        newData.day[date.getDate()] = {
                            transactions: 1,
                            totalIncome: product.subtotal,
                            products: {
                                [key]: {
                                    name: product.name,
                                    quantity: product.quantity,
                                    subtotal: product.subtotal,
                                },
                            },
                        };
                    }
                    const monthData = newData.month[date.getMonth()];
                    if (
                        monthData !== undefined &&
                        monthData.products[key] !== undefined &&
                        newData.lastUpdate.getMonth() <= date.getMonth()
                    ) {
                        newData.month[date.getMonth()].products[key] = {
                            name: monthData.products[key].name,
                            quantity:
                                product.quantity +
                                monthData.products[key].quantity,
                            subtotal:
                                product.subtotal +
                                monthData.products[key].subtotal,
                        };
                    } else {
                        newData.month[date.getMonth()] = {
                            transactions: 1,
                            totalIncome: product.subtotal,
                            products: {
                                [key]: {
                                    name: product.name,
                                    quantity: product.quantity,
                                    subtotal: product.subtotal,
                                },
                            },
                        };
                    }
                    newData.totalIncome += product.subtotal;
                }
            }

            newData.lastUpdate = date;

            if (yearData.docs.length > 0) {
                yearData.docs[0].ref.update(newData);
            } else {
                await doc.ref
                    .collection(collectionNames.RESUME)
                    .doc()
                    .create(newData);
            }

            return true;
        }

        return false;
    } catch (err) {
        functions.logger.error(err);
        throw new functions.https.HttpsError(
            "invalid-argument",
            "some message"
        );
    }
};
