import { errorCodes } from "../errors";
import { RegisterVendorFields } from "../model/types";
import { checkAccountFields } from "../utilities/checkAccount";
import { stringRegex } from "../utilities/checkDataType";

export const checkRegisterVendorFields = (
    input: RegisterVendorFields
): { check: boolean; code: errorCodes } => {
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
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    const specialCheck =
        stringRegex.test(name) &&
        stringRegex.test(surname) &&
        stringRegex.test(enterpriseName) &&
        stringRegex.test(street);

    if (!specialCheck) {
        return { check: false, code: errorCodes.STRING_FORMAT_ERROR };
    }

    const numericCheck = !isNaN(localNumber) && !isNaN(streetNumber);
    if (!numericCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
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
        return { check: false, code: errorCodes.CONFIRM_PASSWORD_ERROR };
    }

    return {
        check: requiredCheck && accountCheck && passwordCheck,
        code: errorCodes.SUCCESFULL,
    };
};
