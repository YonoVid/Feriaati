import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { userStatus } from "../model/accountTypes";
import Encryption, { getRandomBytes } from "./encryption";

export const accountLoginVerification = async (
    collection: string,
    id: string,
    password: string,
    attempt?: number
) => {
    let code, token;
    try {
        const db = admin.firestore();
        const usersRef = db.collection(collection);
        const querySnapshot = usersRef.doc(id);
        const userDoc = await querySnapshot.get();
        let userData = userDoc.data();
        if (
            userDoc.exists &&
            userData?.status === (userStatus.activated as string)
        ) {
            functions.logger.info("DATA COLLECTION::", userData);
            const eConfig = {
                algorithm: userData?.algorithm,
                encryptionKey: process.env.ENCRYPTION_KEY,
                salt: "123",
                iv: userData?.iv as Buffer,
            };
            const desencryption = new Encryption(eConfig);

            if (userData?.password !== desencryption.encrypt(password)) {
                if (attempt && attempt >= 5) {
                    code = "ERL02";
                } else {
                    code = "ERL03";
                }
            } else {
                code = "00000";
            }
        } else if (userData?.type === "temp") {
            if (userData?.password !== password) {
                if (attempt && attempt >= 5) {
                    code = "ERL02";
                } else {
                    code = "ERL03";
                }
            } else {
                code = "00000";
            }
        } else {
            if (userData?.status === (userStatus.blocked as string)) {
                code = "ERL02";
            } else {
                code = "ERL01";
            }
        }
        if ((code = "00000")) {
            token = getRandomBytes(20).toString("hex");
            querySnapshot.update({ token: token });
        } else if ((code = "ERL02")) {
            querySnapshot.update({ status: "blocked" });
        }
    } catch (e) {
        functions.logger.error("ERROR ON ACCOUNT LOGIN::", e);
        throw e;
    }

    return { token: token, code: code };
};
