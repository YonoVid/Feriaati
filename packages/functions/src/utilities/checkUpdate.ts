import { UpdatePassFields } from "../model/types";

export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
        "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const checkUpdatePassFields = (
    input: UpdatePassFields
): { check: boolean; code: string } => {
    const { codigo, password, confirmPassword } = input;

    const codeCheck = codigo != null;
    if (!codeCheck) {
        return { check: false, code: "ERR09" };
    }

    // console.log("Email check", emailCheck);
    const passwordCheck = password != null && password.length < 128;
    if (!passwordCheck) {
        return { check: false, code: "ERR03" };
    }
    // console.log("Password check", passwordCheck);

    const passwordConfirmCheck = password === confirmPassword;
    if (!passwordConfirmCheck) {
        return { check: false, code: "ERR04" };
    }
    // console.log("Password check", passwordCheck);

    return {
        check: codeCheck && passwordCheck && passwordConfirmCheck,
        code: "",
    };
};
