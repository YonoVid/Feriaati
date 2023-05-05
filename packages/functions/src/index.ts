import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { RegisterConfirm, RegisterFields, UserCollectionData, userStatus } from "./types";
import Encryption, { generativeIvOfSize } from "./encryption"
import { getRandomInt } from "./random";

import { checkRegisterFields } from "./checkRegister";
import {sendVerificationMail} from "./mail"

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

// const config = {
//     algorithm: process.env.ALGORITHM,
//     encryptionKey: process.env.ENCRYPTION_KEY,
//     salt: process.env.SALT,
//  }
const config = {
    algorithm: "aes-256-cbc",
    encryptionKey: "KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ",
    salt: "123",
    iv: generativeIvOfSize(16)
};
 const encryption = new Encryption(config);

// ?REFERENCE FUNCTION
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
export const addUser = functions.https.onCall(
    async (data: RegisterFields, context) => {
        try {
            const db = admin.firestore();
            //Checks of data and database
            let {check, msg} = checkRegisterFields(data);
            //Get collection of email data
            const collectionDocReference = db.collection("users").doc(data.email);
            const collectionDoc = await collectionDocReference.get();
    
            functions.logger.info("DATA::", data);
            functions.logger.info("DATA COLLECTION::", collectionDoc);
            
            if (check && (!collectionDoc.exists || collectionDoc.get("status") === "registered")) {
                //Setup document of user data
                const collectionData: UserCollectionData = {
                    username: data.username,
                    email: data.email,
                    password: encryption.encrypt(data.password),
                    algorithm: config.algorithm,
                    status: data.status as string || "null",
                    iv: config.iv,
                    code: getRandomInt(999999).toString().padStart(6, "0")
                }
                functions.logger.info("TO UPLOAD DATA::", collectionData);
    
                //Send email to user with verification code
                sendVerificationMail(data.username, data.email, collectionData.code)
                if(collectionDoc.exists)
                {
                    //Update document in collection if exists
                    collectionDocReference.update(collectionData);
                }
                else{
                    //Creates document in collection of users
                    collectionDocReference.create(collectionData);
                }
                msg = "Data added successfully";
            }
            else if(collectionDoc.exists)
            {
                msg = "Document already exists";
            }
            
            // Returning results.
            return {
                username: data.username,
                email: data.email,
                msg: msg,
            };
            
          } catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError('invalid-argument', "some message");
          }
    }
);

/**
 * Function to register user in the platform requires data of type RegisterField
 * @typeparam RegisterField - is the data from a register form
 */
 export const confirmRegister = functions.https.onCall(
    async (data: RegisterConfirm, context) => {
        try{
            const db = admin.firestore();
            //Store return message
            let msg = "";
            functions.logger.info("DATA", data);
            //Checks of data and database
            const collectionDocReference = db.collection("users").doc(data.email);
    
            const collectionDoc = await collectionDocReference.get();

            functions.logger.info("DATA COLLECTION::", collectionDoc);
            
            if (collectionDoc.exists && (collectionDoc.get("code") === data.code)) {
                //Update document of user data
                collectionDocReference.update({status:userStatus.activated as string});
    
                msg = "Data added successfully";
            }
            else if(collectionDoc.exists)
            {
                msg = "Incorrect code";
            }
            
            // Returning results.
            return {
                email: data.email,
                msg: msg,
            };
        }catch (err) {
            functions.logger.error(err);
            throw new functions.https.HttpsError('invalid-argument', "some message");
          }
    }
);