import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {
    RegisterVendorFields,
    ResponseData,
    VendorCollectionData,
} from "../types";
import Encryption, { generativeIvOfSize } from "../utilities/encryption";
import { getRandomIntString } from "../utilities/random";
import { messagesCode } from "../errors";

//import { sendVerificationMail } from "../utilities/mail";
import { checkRegisterVendorFields } from "./checkRegister";
import { uploadRegisterImage } from "../utilities/storage";

//Setup encryption configuration
//IF YOU USE .env first install dotenv (npm install dotenv --save)
const config = {
    algorithm: process.env.ENCRYPTION_ALGORITHM, //"aes-256-cbc"
    encryptionKey: process.env.ENCRYPTION_KEY, //"KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ"
    salt: process.env.ENCRYPTION_SALT, //"123" IRRELEVANTE
    iv: generativeIvOfSize(16),
};
const encryption = new Encryption(config);

/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
export const addVendor = functions.https.onCall(
    async (data: RegisterVendorFields, context): Promise<ResponseData> => {
        try {
            const db = admin.firestore();
            //Checks of data and database
            let { check, code } = checkRegisterVendorFields(data);
            let error = false;
            //Get collection of email data
            const collectionDocReference = db
                .collection("vendors")
                .doc(data.email);
            const collectionDoc = await collectionDocReference.get();

            functions.logger.info("DATA::", data);
            functions.logger.info("DATA COLLECTION::", collectionDoc);

            if (check) {
                if (
                    !collectionDoc.exists ||
                    collectionDoc.get("status") === "registered"
                ) {
                    functions.logger.info(
                        "IMAGE HAS DATA::",
                        data.image != null
                    );
                    //Upload image
                    const imageURL = await uploadRegisterImage(
                        data.email,
                        data.image
                    );
                    //Setup document of user data
                    const collectionData: VendorCollectionData = {
                        rut: data.rut,
                        enterpriseName: data.enterpriseName,
                        localNumber: data.localNumber,
                        region: data.region,
                        commune: data.commune,
                        street: data.street,
                        streetNumber: data.streetNumber,
                        name: data.name,
                        surname: data.surname,
                        image: imageURL,
                        email: data.email,
                        password: encryption.encrypt(data.password),
                        algorithm: config.algorithm as string,
                        status: (data.status as string) || "null",
                        iv: config.iv,
                        code: getRandomIntString(999999),
                    };
                    functions.logger.info("TO UPLOAD DATA::", collectionData);

                    //Send email to user with verification code
                    // sendVerificationMail(
                    //     data.username,
                    //     data.email,
                    //     collectionData.code
                    // );
                    if (collectionDoc.exists) {
                        //Update document in collection if exists
                        collectionDocReference.update(collectionData);
                    } else {
                        //Creates document in collection of users
                        collectionDocReference.create(collectionData);
                    }
                    code = "00000";
                } else if (collectionDoc.exists) {
                    code = "ERD01";
                    error = true;
                }
            } else {
                error = true;
            }

            // Returning results.
            return {
                email: data.email,
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
