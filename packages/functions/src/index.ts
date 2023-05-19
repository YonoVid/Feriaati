import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sendGrid from "@sendgrid/mail";
import {
  RegisterFields,
  LoginFields,
  UpdatePassFields,
  userStatus,
  UpdateStateFields,
} from "./types";
//import { checkUpdatePassFields } from "./checkUpdate";
import { checkRegisterFields } from "./checkRegister";
import { checkLoginFields } from "./checkLogin";
import { checkUpdatePassFields } from "./checkUpdate";
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
//login usuario
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
      let isLogged = false;

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
          msg = "Contraseña incorrecta";
          if ((data?.attempts as number) >= 5) {
            querySnapshot.update({ status: "blocked" }),
              (msg = "Su cuenta ha sido bloqueada, contactese con soporte");
          }
        } else {
          token = randomBytes(20).toString("hex");
          querySnapshot.update({ token: token });
          msg = "Acceso correcto";
          isLogged = true;
        }
      } else {
        if (userData?.status === (userStatus.blocked as string)) {
          msg = "Su cuenta se encuentra bloqueada, contacte a soporte";
        } else {
          msg = "Usuario no existe";
        }
      }

      return { user: userData?.id, msg: msg, token: token, isLogged: isLogged };
    } catch (err) {
      functions.logger.error(err);
      throw new functions.https.HttpsError("invalid-argument", "some message");
    }
  }
);
//envío de codigo al correo
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

//actualización de pass con el codigo
export const passUpdate = functions.https.onCall(
  async (data: UpdatePassFields) => {
    const db = admin.firestore();
    let { msg } = checkUpdatePassFields(data);
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
        .update({ password: encryption.encrypt(data.password) });
      msg = "Contraseña actualizada con éxito";
    }
    return { mensaje: "data.codigo", msg: msg };
  }
);

//login vendedor
export const loginVendor = functions.https.onCall(
  async (data: LoginFields, context) => {
    try {
      const db = admin.firestore();
      let { msg } = checkLoginFields(data);
      const usersRef = db.collection("vendors");
      const querySnapshot = usersRef.doc(data.email);
      const userDoc = await querySnapshot.get();
      let userData = userDoc.data();
      let token = "";
      let isLogged = false;

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
          msg = "Contraseña incorrecta";
          if ((data?.attempts as number) >= 5) {
            querySnapshot.update({ status: "blocked" }),
              (msg = "Su cuenta ha sido bloqueada, contactese con soporte");
          }
        } else {
          token = randomBytes(20).toString("hex");
          querySnapshot.update({ token: token });
          msg = "Acceso correcto";
          isLogged = true;
        }
      } else {
        if (userData?.status === (userStatus.blocked as string)) {
          msg = "Su cuenta se encuentra bloqueada, contacte a soporte";
        } else if (userData?.status === (userStatus.registered as string)) {
          msg =
            "Su cuenta se encuentra desactivada, un administrador la debe activar";
        } else {
          msg = "Usuario no existe";
        }
      }

      return { user: userData?.id, msg: msg, token: token, isLogged: isLogged };
    } catch (err) {
      functions.logger.error(err);
      throw new functions.https.HttpsError("invalid-argument", "some message");
    }
  }
);
//envío de codigo al correo de vendedor
export const passRecoveryVendor = functions.https.onCall(
  async (email: string) => {
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
      .catch((reason: any) =>
        functions.logger.info(reason, reason.body?.errors)
      );

    db.collection("users").doc(email).update({ passwordCode: codigo });
  }
);
//actualización de contraseña con el código enviado al correo
export const passUpdateVendor = functions.https.onCall(
  async (data: UpdatePassFields) => {
    const db = admin.firestore();
    let { msg } = checkUpdatePassFields(data);
    const usersRef = db.collection("vendors");
    const querySnapshot = usersRef.doc(data.email);
    const userDocR = await querySnapshot.get();
    const userDoc = userDocR.data();
    //console.log(userDoc?.passwordCode);
    functions.logger.info(data.codigo);
    if (userDoc?.passwordCode === data.codigo) {
      functions.logger.info("hola");
      db.collection("users")
        .doc(data.email)
        .update({ password: encryption.encrypt(data.password) });
      msg = "Contraseña actualizada con éxito";
    }
    return { mensaje: "data.codigo", msg: msg };
  }
);

export const vendorList = functions.https.onCall(async () => {
  try {
    const db = admin.firestore();
    const usersRef = db.collection("vendors");
    const querySnapshot = await usersRef.get();
    const vendors: any[] = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      vendors.push({ ...userData, id: doc.id });
    });

    return vendors;
  } catch (error) {
    functions.logger.error(error);
    throw new functions.https.HttpsError(
      "internal",
      "Error al obtener datos de los vendedores"
    );
  }
});
export const vendorStateUpdate = functions.https.onCall(
  async (data: UpdateStateFields, context) => {
    try {
      const db = admin.firestore();
      const vendorRef = db.collection("vendors");

      // obtiene id y estado del usuario
      const { id, state } = data;

      // revisa el estado del usuario
      const newState =
        state === userStatus.activated
          ? userStatus.registered
          : userStatus.activated;

      // actualiza el estado del usuario
      await vendorRef.doc(id).update({ state: newState });

      return { mensaje: "Estado del vendedor actualizado correctamente" };
    } catch (error) {
      functions.logger.error(error);
      throw new functions.https.HttpsError(
        "internal",
        "Error al actualizar el estado del vendedor"
      );
    }
  }
);
