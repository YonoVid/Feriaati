import crypto from "crypto";

interface IConfig {
    algorithm?: string;
    encryptionKey?: string;
    salt?: string;
    iv?: Buffer;
}

export const generativeIvOfSize = (size: number): Buffer => {
    return crypto.randomBytes(size);
};

export const getRandomBytes = (size: number) => crypto.randomBytes(size);

/**
 * Class to make a encryptor object with initial settings
 */
export default class Encryption {
    private algorithm: string;
    private key: Buffer | string;
    // private salt: string;
    private iv: Buffer | null;

    /**
     * Function to construct class
     * @param {IConfig} config Initial settings with algorithm and keys
     */
    constructor(config: IConfig) {
        this.algorithm = config.algorithm || "";
        // this.salt = config.salt || "";
        // encode encryption key from utf8 to hex
        const ENCRYPTION_KEY = config.encryptionKey
            ? Buffer.from(config.encryptionKey).toString("hex")
            : "";
        // initialize key
        this.key = ENCRYPTION_KEY ? Buffer.from(ENCRYPTION_KEY, "hex") : "";
        // initialize IV
        this.iv = config.iv || null;

        // validate missing config options
        if (!this.algorithm && !this.key) {
            throw Error(
                "Configuration Error! Algorithm::" +
                    this.algorithm +
                    "|Key::" +
                    this.key
            );
        }
    }

    /**
     * Function to get avalible encryption algorithms
     * @return {string[]}
     */
    getHashes = () => {
        return crypto.getHashes();
    };

    /**
     * Function to encrypt a string into a url slug
     * @param {string }value Value to encrypt
     * @param {boolean } isInt If the value is a number or not
     * @return {string | null} Value encrypted
     */
    encrypt = (value?: string | number, isInt = false): string => {
        // Validate missing value
        if (!value) {
            throw Error("A value is required!");
        }

        // Initialize Cipher instance
        if (this.iv == null) {
            this.iv = crypto.randomBytes(16);
        }
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);

        // Return Buffer as a binary encoded string
        let buffer = Buffer.from(String(value), "utf8").toString("binary");

        // Support for small and big integers
        if (isInt) {
            // Set byte auto padding to false
            cipher.setAutoPadding(false);

            // allocate Buffer instance 8 bytes
            const buf = Buffer.allocUnsafe(8);
            /* global BigInt */
            // Write value to buf instance at the specified offset as big-endian.
            buf.writeBigUInt64BE(BigInt(value));
            buffer = buf.toString("binary");
        }

        // Get encrypted data from the cipher instance
        const firstPart = cipher.update(buffer, "binary", "base64");
        const finalPart = cipher.final("base64");

        // concat and return both parts
        return `${firstPart}${finalPart}`;
    };

    /**
     * Function to decrypt a url token
     * @param {string} token Value to be decrypted
     * @param {boolean} isInt If the value is a number
     * @return {string | null} Value decrypted
     */
    decrypt = (token?: string, isInt = false): string => {
        // Validate missing token
        if (!token) {
            throw Error("A token is required!");
        }

        // Initialize Decipher instance
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            this.iv
        );

        // Support for small and big integers
        if (isInt) {
            // Set byte auto padding to false
            decipher.setAutoPadding(false);
        }
        // encodes encrypted value from base64 to hex
        const buffer = Buffer.from(token, "base64").toString("hex");

        // Get decrypted data from decipher instance
        const firstPart = decipher.update(buffer, "hex", "base64");
        const finalPart = decipher.final("base64") || "";

        // concat both parts
        const decrypted = `${firstPart}${finalPart}`;

        // Encode decrypted value as a 64-bit Buffer
        const buf = Buffer.from(decrypted, "base64");

        // Support for small and big integers
        if (isInt) {
            // Reads an unsigned, big-endian 64-bit integer from buf at the specified offset
            // and returns as a string
            return buf.readBigUInt64BE(0).toString();
        }
        // convert decrypted value from base64 to utf-8 string
        return buf.toString("utf8");
    };
}

// Setup encryption configuration
// IF YOU USE .env first install dotenv (npm install dotenv --save)
export const config = {
    algorithm: process.env.ENCRYPTION_ALGORITHM, // "aes-256-cbc"
    encryptionKey: process.env.ENCRYPTION_KEY, // "KQIusXppu9dIj0JHa6yRtMOgqW7qUyJQ"
    salt: process.env.ENCRYPTION_SALT, // "123" IRRELEVANTE
    iv: generativeIvOfSize(16),
};
export const encryption = new Encryption(config);
