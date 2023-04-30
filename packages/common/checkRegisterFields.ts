import { RegisterFields } from "./RegisterFields";

export const emailFormatRegex = new RegExp(
    "(?:[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+\\/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",
    "gm"
);

export const checkRegisterFields = (input: RegisterFields): boolean => {
    const { username, email, password, confirmPassword } = input;

    const userCheck = username != null && username.length < 18;
    // console.log("Username check", userCheck);
    const emailCheck =
        email != null && emailFormatRegex.test(email) && email.length < 254;
    // console.log("Email check", emailCheck);
    const passwordCheck =
        password != null &&
        password.length < 128 &&
        password === confirmPassword;
    // console.log("Password check", passwordCheck);

    return userCheck && emailCheck && passwordCheck;
};
