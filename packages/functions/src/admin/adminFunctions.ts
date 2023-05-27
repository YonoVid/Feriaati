import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
    LoginFields,
    ResponseData,
    UpdateStateFields,
    userStatus,
} from "../types";
import Encryption, {
    generativeIvOfSize,
    getRandomBytes,
} from "../utilities/encryption";

import { checkAccountFields } from "../utilities/checkAccount";
import { messagesCode } from "../errors";

//Setup encryption configuration
//IF YOU USE .env first install dotenv (npm install dotenv --save)
const config = {
    algorithm: process.env.ENCRYPTION_ALGORITHM, //"aes-256-cbc"
    encryptionKey: process.env.ENCRYPTION_KEY, //"KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ"
    salt: process.env.ENCRYPTION_SALT, //"123" IRRELEVANTE
    iv: generativeIvOfSize(16),
};
//const encryption = new Encryption(config);

// ?REFERENCE FUNCTION
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const adminLogin = functions.https.onCall(
    async (data: LoginFields, context): Promise<ResponseData> => {
        try {
            const db = admin.firestore();
            let token = "";
            let error = false;
            //let isLogged = false;
            let { check, code } = checkAccountFields(data);

            if (check) {
                const usersRef = db.collection("admin");
                const querySnapshot = usersRef.doc(data.email);
                const userDoc = await querySnapshot.get();
                let userData = userDoc.data();
                if (
                    userDoc.exists &&
                    userData?.status === (userStatus.activated as string)
                ) {
                    functions.logger.info("DATA COLLECTION::", userData);
                    const eConfig = {
                        algorithm: userData?.algorithm,
                        encryptionKey: config.encryptionKey,
                        salt: "123",
                        iv: userData?.iv as Buffer,
                    };
                    const desencryption = new Encryption(eConfig);

                    if (
                        userData?.password !==
                        desencryption.encrypt(data.password)
                    ) {
                        if ((data?.attempts as number) >= 5) {
                            querySnapshot.update({ status: "blocked" }),
                                (code = "ERL02");
                        } else {
                            code = "ERL03";
                        }
                    } else {
                        token = getRandomBytes(20).toString("hex");
                        querySnapshot.update({ token: token });
                        code = "00000";
                        //isLogged = true;
                    }
                } else {
                    if (userData?.status === (userStatus.blocked as string)) {
                        code = "ERL02";
                    } else {
                        code = "ERL01";
                    }
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
                extra: { token: token },
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
