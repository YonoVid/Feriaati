import { Options } from "browser-image-compression";
import imageCompression from "browser-image-compression";

export const compressImage = async (image: File) => {
    const options: Options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1500,
        useWebWorker: true,
    };

    try {
        const value = await imageCompression(image, options);
        return value;
    } catch (e) {
        console.log(e);
    }
};
