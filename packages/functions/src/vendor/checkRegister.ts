import { errorCodes } from "../errors";
import {
    RegisterContributorFields,
    RegisterVendorFields,
} from "../model/types";
import { checkAccountFields } from "../utilities/checkAccount";

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
    // Check required values exist
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

    // Check account data rules
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    const { check: accountCheck, code: accountCode } = checkAccountFields({
        email: email,
        password: password,
    });
    if (accountCheck) {
        return { check: accountCheck, code: accountCode };
    }

    // Check passwords are equal
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

export const checkRegisterContributorFields = (
    input: RegisterContributorFields
): { check: boolean; code: errorCodes } => {
    const { email, password, confirmPassword } = input;
    // Check required values exist
    const requiredCheck = email != null && password != null;
    // console.log("Username check", userCheck);

    // Check account data rules
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    const { check: accountCheck, code: accountCode } = checkAccountFields({
        email: email,
        password: password,
    });
    if (accountCheck) {
        return { check: accountCheck, code: accountCode };
    }

    // Check passwords are equal
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
