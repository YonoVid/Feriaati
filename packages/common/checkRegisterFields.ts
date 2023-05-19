import {
    AccountFields,
    RegisterFields,
    RegisterVendorFields,
} from "./model/registerFields";

export const rutFormatRegex = new RegExp(/\b[0-9]{1,8}\-[K|k|0-9]$/gim);
export const numberRegex = new RegExp(/\b[0-9]+$/gim);
export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const passwordFormatRegex = new RegExp(
    /^(?=.*[a-zA-Zñ])(?=.*[0-9])[A-Zña-z0-9!@#$%^&+=*.\\\-_]+$/
);

export const checkRutVerificationCode = (rut: number, code: number): boolean =>
    checkRutVerificationCodeString(rut.toString() + "-" + code.toString());

export const checkRutVerificationCodeString = (input: string): boolean => {
    let sum = 0,
        serieIndex = 0;
    let values = input
        .replace(/[kK]/, "11")
        .replace(/[^0-9\-]/gi, "")
        .split("-");
    const serie = [2, 3, 4, 5, 6, 7];

    for (let i = values[0].length - 1; i >= 0; i--) {
        sum += parseInt(values[0][i]) * serie[serieIndex];
        serieIndex = serieIndex + 1 < serie.length ? serieIndex + 1 : 0;
    }

    console.log(values, sum);
    return 11 - (sum % 11) == parseInt(values[1]);
};

export const checkAccountFields = (input: AccountFields): boolean => {
    const { email, password } = input;

    const emailCheck =
        email != null && emailFormatRegex.test(email) && email.length < 254;
    // console.log("Email check", emailCheck);
    const passwordCheck =
        password != null &&
        password.length < 128 &&
        passwordFormatRegex.test(password);
    // console.log("Password check", passwordCheck);

    return emailCheck && passwordCheck;
};

export const checkRegisterFields = (input: RegisterFields): boolean => {
    const { username, email, password, confirmPassword } = input;

    const userCheck = username != null && username.length < 18;
    // console.log("Username check", userCheck);

    const confirmPasswordChech = password === confirmPassword;
    // console.log("Password check", passwordCheck);

    return (
        userCheck &&
        checkAccountFields({ email: email, password: password }) &&
        confirmPasswordChech
    );
};

export const checkRegisterVendorFields = (
    input: RegisterVendorFields
): boolean => {
    const {
        name,
        surname,
        enterpriseName,
        localNumber,
        region,
        commune,
        street,
        streetNumber,
        email,
        password,
        confirmPassword,
    } = input;

    const requiredCheck =
        name != null &&
        surname != null &&
        enterpriseName != null &&
        localNumber != null &&
        region != null &&
        commune != null &&
        street != null &&
        streetNumber != null;
    // console.log("Username check", userCheck);

    const confirmPasswordCheck = password === confirmPassword;
    // console.log("Password check", passwordCheck);

    return (
        checkAccountFields({ email: email, password: password }) &&
        requiredCheck &&
        confirmPasswordCheck
    );
};
