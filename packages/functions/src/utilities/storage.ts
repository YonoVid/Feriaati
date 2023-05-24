import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as mime from "mime";

export const uploadRegisterImage = async (email: string, image: string) => {
    if (image == null) {
        throw new functions.https.HttpsError("invalid-argument", "ERR00");
    }

    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

    functions.logger.info("MIME TYPE STRING MATCH::", mimeType);
    functions.logger.info("MIME TYPE STRING MATCH::", mimeType && mimeType[1]);

    const base64EncodedImageString: string = image.replace(
        /^data:image\/\w+;base64,/,
        ""
    );
    const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

    const filename = `register/vendor/${email}.${mime.getExtension(
        mimeType != null ? mimeType[1] : ""
    )}`;
    const file = admin.storage().bucket().file(filename);
    await file.save(imageBuffer, {
        contentType: mimeType ? mimeType[1] : "image/jpeg",
    });
    const photoURL = await file
        .getSignedUrl({ action: "read", expires: "03-09-2491" })
        .then((urls) => urls[0]);

    return photoURL;
};
