export const rutFormatRegex = new RegExp(/\b[0-9]{1,8}-[K|k|0-9]$/im);
// Check if string don't use special characters
export const stringRegex = new RegExp(/^[^()!<>=+\-{}[\]]*$/im);
// Check if string only contains numbers
export const numberRegex = new RegExp(/\b[0-9]+$/i);
// Check if string has correct email format
export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const phoneFormatRegex = new RegExp(
    /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
);
