export const rutFormatRegex = new RegExp(/\b[0-9]{1,8}\-[K|k|0-9]$/gim);
export const numberRegex = new RegExp(/\b[0-9]+$/gim);
export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);
