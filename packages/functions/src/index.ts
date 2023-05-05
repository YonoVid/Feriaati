import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sendGrid from "@sendgrid/mail";
import {
  RegisterFields,
  LoginFields,
  UpdatePassFields,
  userStatus,
} from "./types";
//import { checkUpdatePassFields } from "./checkUpdate";
import { checkRegisterFields } from "./checkRegister";
import { checkLoginFields } from "./checkLogin";
import Encryption, { generativeIvOfSize } from "./encryption";
import { randomBytes } from "crypto";
import { getRandomInt } from "./random";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);
sendGrid.setApiKey(
  "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"
);

// const config = {
//     algorithm: process.env.ALGORITHM,
//     encryptionKey: process.env.ENCRYPTION_KEY,
//     salt: process.env.SALT,
//  }
const config = {
  algorithm: "aes-256-cbc",
  encryptionKey: "KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ",
  salt: "123",
  iv: generativeIvOfSize(16),
};
const encryption = new Encryption(config);

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const addUser = functions.https.onCall(
  async (data: RegisterFields, context) => {
    const db = admin.firestore();
    //Checks of data and database
    let { check, msg } = checkRegisterFields(data);
    const collectionCheck = await db.collection("users").doc(data.email).get();

    functions.logger.info("DATA::", data);
    functions.logger.info("DATA COLLECTION::", collectionCheck);

    if (check && !collectionCheck.exists) {
      const collectionData = {
        username: data.username,
        email: data.email,
        password: encryption.encrypt(data.password),
        algorithm: config.algorithm,
        status: userStatus.activated || "null",
        iv: config.iv,
        encryptionKey: config.encryptionKey,
        code: getRandomInt(999999).toString().padStart(6, "0"),
      };
      functions.logger.info("TO UPLOAD DATA::", collectionData);

      sendGrid
        .send({
          to: data.email, // Change to your recipient
          from: "feriaati@gmail.com", // Change to your verified sender
          text: "Message to register " + data.username,
          templateId: process.env.REGISTER_TEMPLATE_ID,
          dynamicTemplateData: {
            username: data.username,
            code: collectionData.code,
          },
        })
        .catch((reason: any) =>
          functions.logger.info(reason, reason.body?.errors)
        );

      db.collection("users").doc(data.email).create(collectionData);
      msg = "Data added successfully";
    } else if (collectionCheck.exists) {
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

export const login = functions.https.onCall(
  async (data: LoginFields, context) => {
    try {
      const db = admin.firestore();

      let { msg } = checkLoginFields(data);
      const usersRef = db.collection("users");
      const querySnapshot = usersRef.doc(data.email);
      const userDoc = await querySnapshot.get();
      let userData = userDoc.data();
      let token = "";

      if (
        userDoc.exists &&
        userData?.status === (userStatus.activated as string)
      ) {
        functions.logger.info("DATA COLLECTION::", userData);
        functions.logger.info("DATA COLLECTION::", userData?.iv as Buffer);
        const config = {
          algorithm: userData?.algorithm,
          encryptionKey: userData?.encryptionKey,
          salt: "123",
          iv: userData?.iv as Buffer,
        };
        const desencryption = new Encryption(config);

        if (userData?.password !== desencryption.encrypt(data.password)) {
          msg = "password incorrecta";
          if ((data?.attempts as number) >= 5) {
            querySnapshot.update({ status: "blocked" }),
              (msg = "su cuenta ha sido bloqueada, contactese con soporte");
          }
        } else {
          token = randomBytes(20).toString("hex");
          querySnapshot.update({ token: token });
        }
      } else {
        msg = "Usuario no existe";
      }

      return { user: userData?.id, msg: msg, token: token };
    } catch (err) {
      functions.logger.error(err);
      throw new functions.https.HttpsError("invalid-argument", "some message");
    }
  }
);
export const passRecovery = functions.https.onCall(async (email: string) => {
  const db = admin.firestore();
  const codigo = getRandomInt(999999).toString().padStart(6, "0");
  sendGrid
    .send({
      to: email,
      from: "feriaati@gmail.com",
      text: " ",
      templateId: "d-4e7a9b52ff65492f9d702217d4e9f51d",
      dynamicTemplateData: {
        Codigo: codigo,
      },
    })
    .catch((reason: any) => functions.logger.info(reason, reason.body?.errors));

  db.collection("users").doc(email).update({ passwordCode: codigo });
});
export const passUpdate = functions.https.onCall(
  async (data: UpdatePassFields) => {
    const db = admin.firestore();
    //let { msg } = checkUpdatePassFields(data);
    const usersRef = db.collection("users");
    const querySnapshot = usersRef.doc(data.email);
    const userDocR = await querySnapshot.get();
    const userDoc = userDocR.data();
    //console.log(userDoc?.passwordCode);
    functions.logger.info(data.codigo);
    if (userDoc?.passwordCode === data.codigo) {
      functions.logger.info("hola");
      db.collection("users")
        .doc(data.email)
        .update({ password: data.password });
    }
    return { mensaje: "data.codigo" };
  }
);
