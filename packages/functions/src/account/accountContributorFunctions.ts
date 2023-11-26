import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ResponseData } from "../model/reponseFields";
import {
    AccountCollectionData,
    ContributorCollectionData,
    ContributorData,
    ContributorLevel,
    userStatus,
    userType,
    VendorCollectionData,
} from "../model/accountTypes";
import {
    DeleteFields,
    RegisterContributorFields,
    UpdateContributorFields,
} from "../model/types";
import { getAccount, getAccountCount } from "../utilities/account";
import { encryption, config } from "../utilities/encryption";
import { errorCodes, messagesCode } from "../errors";
import { collectionNames } from "../consts";

import { checkRegisterContributorFields } from "../vendor/checkRegister";
import { generateContributorIdentifier } from "../utilities/identifiers";
import { checkUpdateContributorFields } from "../vendor/checkContributor";
import { updatePasswordValues } from "../utilities/updateAccount";
import { getAccountVendor } from "./accountVendorFunctions";

/**
 * Function to register contributor in the platform requires data of type RegisterContributorField
 * @typeparam ContributorField - is the data from a register form
 */
export const addContributor = functions.https.onCall(
    async (
        data: RegisterContributorFields,
        context
    ): Promise<ResponseData<ContributorData>> => {
        try {
            //Checks of data and database
            let { check, code } = checkRegisterContributorFields(data);
            let error = true;
            //Get collection of email data

            functions.logger.info("DATA::", data);

            if (check) {
                let { doc, code: vendorCode } = await getAccountVendor(
                    {
                        token: data.token,
                        email: data.email,
                    },
                    ContributorLevel.MANAGER
                );
                if (vendorCode === errorCodes.SUCCESFULL) {
                    let vendorData = doc.data() as VendorCollectionData;

                    const { user: testUser } = generateContributorIdentifier({
                        first: data.name,
                        second: data.surname,
                    });

                    let { code: accountCode, quantity: docQuantity } =
                        await getAccountCount({
                            collection: collectionNames.CONTRIBUTORS,
                            value: testUser,
                            field: "email",
                            exactSearch: false,
                        });
                    code = accountCode;
                    if (
                        vendorData.productsId != null &&
                        vendorData.productsId != undefined
                    ) {
                        const { identifier, password } =
                            generateContributorIdentifier({
                                first: data.name,
                                second: data.surname,
                                index: docQuantity,
                            });

                        //Setup document of user data
                        const collectionData: ContributorCollectionData = {
                            creationDate: new Date(),
                            name: data.name,
                            surname: data.surname,
                            productsId: vendorData.productsId as string,
                            permissions: ContributorLevel.MANAGER,
                            isDeleted: false,
                            type: userType.contributor,
                            email: identifier,
                            password: encryption.encrypt(password),
                            algorithm: config.algorithm as string,
                            status:
                                (data.status as string) ||
                                userStatus.registered,
                            iv: config.iv,
                        };
                        functions.logger.info(
                            "TO UPLOAD DATA::",
                            collectionData
                        );
                        const db = admin.firestore();
                        //Creates document in collection of users
                        const document = db
                            .collection(collectionNames.CONTRIBUTORS)
                            .doc();
                        await document.create(collectionData);

                        return {
                            extra: {
                                type: collectionData.type,
                                name: collectionData.name,
                                email: collectionData.email,
                                password: "**********",
                                surname: collectionData.surname,
                                permissions: collectionData.permissions,
                                productsId: collectionData.productsId,
                                id: document.id,
                            },
                            error: false,
                            code: errorCodes.SUCCESFULL,
                            msg: messagesCode[errorCodes.SUCCESFULL],
                        };
                    } else {
                        code = errorCodes.DOCUMENT_ALREADY_EXISTS_ERROR;
                    }
                } else {
                    code = vendorCode;
                }
            }

            // Returning results.
            return {
                extra: {},
                error: error,
                code: code,
                msg: messagesCode[code],
            };
        } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError("invalid-argument", "ERR00");
        }
    }
);

export const updateContributor = functions.https.onCall(
    async (
        data: UpdateContributorFields,
        context: any
    ): Promise<ResponseData<AccountCollectionData>> => {
        try {
            functions.logger.info("DATA::", data);
            let { check, code } = checkUpdateContributorFields(data);

            if (check) {
                let { doc, code: vendorCode } = await getAccountVendor(
                    {
                        token: data.token,
                        email: data.email,
                    },
                    ContributorLevel.MANAGER
                );
                if (vendorCode === errorCodes.SUCCESFULL) {
                    const vendorData = doc.data() as VendorCollectionData;

                    const { code: accountCode, doc: docContributor } =
                        await getAccount(collectionNames.CONTRIBUTORS, {
                            id: data.contributorId,
                        });
                    code = accountCode;

                    const contributorData =
                        (await docContributor.data()) as ContributorCollectionData;

                    functions.logger.info(contributorData);
                    if (
                        vendorData.productsId != undefined &&
                        vendorData.productsId === contributorData.productsId &&
                        vendorData.productsId === data.productsId
                    ) {
                        let contributorUpdate: ContributorCollectionData = {
                            ...contributorData,
                            name: data.name || contributorData.name,
                            surname: data.surname || contributorData.surname,
                            email: contributorData.email,
                            permissions:
                                data.permission || contributorData.permissions,
                            isDeleted: false,
                        };

                        if (data.password && data.password != null) {
                            const passwordUpdate = updatePasswordValues({
                                email: contributorData.email,
                                codigo: "",
                                password: data.password,
                                confirmPassword: data.confirmPassword as string,
                            });

                            contributorUpdate = {
                                ...contributorUpdate,
                                ...passwordUpdate,
                            };
                        }

                        if (data.name != null && data.surname != null) {
                            const {
                                user: testUser,
                                identifier: testIdentifier,
                            } = generateContributorIdentifier({
                                first: data.name || contributorData.name,
                                second: data.surname || contributorData.surname,
                                index: 0,
                            });

                            const { quantity } = await getAccountCount({
                                collection: collectionNames.CONTRIBUTORS,
                                value: testUser,
                                field: "email",
                                exactSearch: false,
                            });

                            if (quantity >= 0) {
                                const { identifier: newIdentifier } =
                                    generateContributorIdentifier({
                                        first:
                                            data.name || contributorData.name,
                                        second:
                                            data.surname ||
                                            contributorData.surname,
                                        index: quantity,
                                    });
                                contributorUpdate.email = newIdentifier;
                            } else {
                                contributorUpdate.email = testIdentifier;
                            }
                        }

                        if (contributorData !== contributorUpdate) {
                            functions.logger.info(contributorUpdate);
                            await docContributor.ref.update(contributorUpdate);
                        }
                        //Hide password for return message
                        const returnData: ContributorData = {
                            id: docContributor.id,
                            status: contributorUpdate.status,
                            type: contributorUpdate.type,
                            email: contributorUpdate.email,
                            password: "**********",
                            creationDate: contributorUpdate.creationDate,
                            name: contributorUpdate.name,
                            surname: contributorUpdate.surname,
                            permissions: contributorUpdate.permissions,
                            productsId: contributorData.productsId,
                        };

                        const error = code !== errorCodes.SUCCESFULL;
                        return {
                            error: error,
                            code: code,
                            msg: messagesCode[code],
                            extra: error ? {} : returnData,
                        };
                    } else {
                        code = errorCodes.VENDOR_PERMISSION_ERROR;
                    }
                } else {
                    code = vendorCode;
                }
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
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

export const deleteContributor = functions.https.onCall(
    async (data: DeleteFields, context: any): Promise<ResponseData<string>> => {
        try {
            functions.logger.info("DATA::", data);
            let code = errorCodes.MISSING_REQUIRED_DATA_ERROR;

            if (
                data.itemId != null &&
                data.itemId != undefined &&
                data.token != null &&
                data.token != undefined
            ) {
                let { doc, code: vendorCode } = await getAccountVendor(
                    {
                        token: data.token,
                        email: data.email,
                    },
                    ContributorLevel.MANAGER
                );
                code = vendorCode;
                if (vendorCode === errorCodes.SUCCESFULL) {
                    const vendorData = doc.data() as VendorCollectionData;

                    const { code: accountCode, doc: docContributor } =
                        await getAccount(collectionNames.CONTRIBUTORS, {
                            id: data.itemId,
                        });
                    code = accountCode;

                    const contributorData =
                        (await docContributor.data()) as ContributorCollectionData;

                    functions.logger.info(contributorData);
                    if (
                        vendorData.productsId != undefined &&
                        vendorData.productsId === contributorData.productsId
                    ) {
                        functions.logger.info(contributorData);
                        await docContributor.ref.delete();

                        const error = code !== errorCodes.SUCCESFULL;
                        return {
                            error: error,
                            code: code,
                            msg: messagesCode[code],
                            extra: error ? {} : docContributor.id,
                        };
                    } else {
                        code = errorCodes.VENDOR_PERMISSION_ERROR;
                    }
                } else {
                    code = vendorCode;
                }
            }
            return {
                msg: messagesCode[code],
                code: code,
                error: true,
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
