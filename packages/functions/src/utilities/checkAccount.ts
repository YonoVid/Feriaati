import { AccountFields } from "../types";

export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
        "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const passwordFormatRegex = new RegExp(
    /^(?=.*[a-zA-Zñ])(?=.*[0-9])[A-Zña-z0-9!@#$%^&+=*.\\\-_]+$/
);

export const checkAccountFields = (
    input: AccountFields
): { check: boolean; code: string } => {
    const { email, password } = input;

    // console.log("Username check", userCheck);
    const emailCheck =
        email != null && emailFormatRegex.test(email) && email.length < 254;
    if (!emailCheck) {
        return { check: false, code: "ERR02" };
    }
    // console.log("Email check", emailCheck);
    const passwordCheck = password != null && password.length < 128;
    if (!passwordCheck) {
        return { check: false, code: "ERR03" };
    }
    // console.log("Password check", passwordCheck);

    return { check: emailCheck && passwordCheck, code: "" };
};
