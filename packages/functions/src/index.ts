import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { RegisterFields } from "./types";
import { checkRegisterFields } from "./checkRegister";
import Encryption, { generativeIvOfSize } from "./encryption"

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

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const addUser = functions.https.onCall(
    async (data: RegisterFields, context) => {
        const db = admin.firestore();
        //Checks of data and database
        let {check, msg} = checkRegisterFields(data);
        const collectionCheck = await db.collection("users").doc(data.email).get();

        functions.logger.info("DATA::", data);
        functions.logger.info("DATA COLLECTION::", collectionCheck);
        
        if (check && !collectionCheck.exists) {
            const collectionData = {
                username: data.username,
                email: data.email,
                password: encryption.encrypt(data.password),
                algorithm: config.algorithm,
                iv: config.iv
            }
            db.collection("users").doc(data.email).create(collectionData);
            msg = "Data added successfully";
        }
        else if(collectionCheck.exists)
        {
            msg = "Document already exists";
        }
        // returning result.
        return {
            username: data.username,
            email: data.email,
            msg: msg,
        };
    }
);

// export const onAddUser = functions.database
//     .ref("/users/{pushId}")
//     .onWrite((event) => {
//         const getSomethingPromise = admin
//             .database()
//             .ref(`/users/{pushId}`)
//             .once("value");
//         return getSomethingPromise.then((results) => {
//             const somethingSnapshot = results[0];
//             // Do something with the snapshot
//         });
//     });
