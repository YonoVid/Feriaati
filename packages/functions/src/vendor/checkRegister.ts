import { RegisterVendorFields } from "../model/types";
import { checkAccountFields } from "../utilities/checkAccount";

export const checkRegisterVendorFields = (
    input: RegisterVendorFields
): { check: boolean; code: string } => {
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
    //Check required values exist
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

    //Check account data rules
    if (!requiredCheck) {
        return { check: false, code: "ERR09" };
    }
    const { check: accountCheck, code: accountCode } = checkAccountFields({
        email: email,
        password: password,
    });
    if (accountCheck) {
        return { check: accountCheck, code: accountCode };
    }

    //Check passwords are equal
    const passwordCheck = password === confirmPassword;
    // console.log("Password check", passwordCheck);
    if (!passwordCheck) {
        return { check: false, code: "ERR03" };
    }

    return { check: requiredCheck && accountCheck && passwordCheck, code: "" };
};
