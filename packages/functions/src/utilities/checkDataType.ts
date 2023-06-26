export const rutFormatRegex = new RegExp(/\b[0-9]{1,8}\-[K|k|0-9]$/im);
export const numberRegex = new RegExp(/\b[0-9]+$/im);
export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const phoneFormatRegex = new RegExp(
    /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
);
