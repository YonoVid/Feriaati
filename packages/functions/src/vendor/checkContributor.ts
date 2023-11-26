import { errorCodes } from "../errors";
import { UpdateContributorFields } from "../model/types";

export const checkUpdateContributorFields = (
    input: UpdateContributorFields
): { check: boolean; code: errorCodes } => {
    const {
        name,
        surname,
        password,
        confirmPassword,
        permission,
        productsId,
        token,
        id,
    } = input;
    //Check required values exist
    const requiredCheck =
        productsId != null &&
        (token != null || id != null) &&
        (name != null ||
            password != null ||
            surname != null ||
            permission != null);

    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    const optionalCheck =
        (name != null || name == undefined) &&
        (surname != null || surname == undefined) &&
        (password != null || password == undefined) &&
        (permission != null || permission == undefined);

    if (!optionalCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    //Check passwords are equal
    const passwordCheck =
        password == undefined ||
        password == null ||
        password === confirmPassword;
    // console.log("Password check", passwordCheck);
    if (!passwordCheck) {
        return { check: false, code: errorCodes.CONFIRM_PASSWORD_ERROR };
    }

    return {
        check: requiredCheck && optionalCheck && passwordCheck,
        code: errorCodes.SUCCESFULL,
    };
};
