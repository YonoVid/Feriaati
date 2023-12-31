import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as mime from "mime";

/**
 * Function to upload a image to firebase cloud storage
 * @param {string} id Id of related user
 * @param {string} location Location to store the image
 * @param {string} image Data of the image as a string
 * @param {boolean} privateAccess If the permission to access is private
 */
export const uploadImage = async (
    id: string,
    location: string,
    image: string,
    privateAccess?: boolean
) => {
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

    const filename = `${location + "/" + id}.${mime.getExtension(
        mimeType != null ? mimeType[1] : ""
    )}`;
    const file = admin.storage().bucket().file(filename);
    await file.save(imageBuffer, {
        contentType: mimeType ? mimeType[1] : "image/jpeg",
    });
    if (privateAccess) {
        const photoURL = await file
            .getSignedUrl({ action: "read", expires: "03-09-2491" })
            .then((urls) => urls[0]);
        return photoURL;
    }

    file.makePublic();
    return file.publicUrl();
};

/**
 * Function to upload a image to register of vendor location
 * @param {string} email Email of the related user
 * @param {string} image Data of the image as a string
 */
export const uploadRegisterImage = async (email: string, image: string) =>
    uploadImage(email, "register/vendor", image);
/**
 * Function to upload a image to vendor product location
 * @param {string} id Id of the related product
 * @param {string} image Data of the image as a string
 */
export const uploadProductImage = async (id: string, image: string) =>
    uploadImage(id, "vendor/products", image);
/**
 * Function to upload a image to vendor location
 * @param {string} id Id of the related related vendor
 * @param {string} image Data of the image as a string
 */
export const uploadVendorProductImage = async (id: string, image: string) =>
    uploadImage(id, "vendor", image);
