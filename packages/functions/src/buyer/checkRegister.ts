import { RegisterFields } from "../types";
import { checkAccountFields } from "../utilities/checkAccount";

export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
        "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const passwordFormatRegex = new RegExp(
    /^(?=.*[a-zA-Zñ])(?=.*[0-9])[A-Zña-z0-9!@#$%^&+=*.\\\-_]+$/
);

export const checkRegisterFields = (
    input: RegisterFields
): { check: boolean; code: string } => {
    const { username, email, password, confirmPassword } = input;

    const { check: accountCheck, code: accountCode } = checkAccountFields({
        email: email,
        password: password,
    });
    if (accountCheck) {
        return { check: accountCheck, code: accountCode };
    }

    const userCheck = username != null && username.length < 18;
    if (!userCheck) {
        return { check: false, code: "ERR01" };
    }
    // console.log("Username check", userCheck);
    const passwordCheck = password === confirmPassword;
    if (!passwordCheck) {
        return { check: false, code: "ERR03" };
    }
    // console.log("Password check", passwordCheck);

    return { check: userCheck && accountCheck && passwordCheck, code: "" };
};
