//Check if string don't use special characters
export const stringRegex = new RegExp(/^[^()!<>=+\-{}[\]]*$/im);
//Check if string only contains numbers
export const numberRegex = new RegExp(/\b[0-9]+$/i);
//Check if string has correct email format
export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);
//Check if string has a alphanumeric password format
export const passwordFormatRegex = new RegExp(
    /^(?=.*[a-zA-Zñ])(?=.*[0-9])[A-Zña-z0-9!@#$%^&+=*.\\\-_]+$/
);
