import { EditAccountFields, GetAccountFields } from "../model/types";
import { userType } from "../model/accountTypes";
import { errorCodes } from "../errors";
import { phoneFormatRegex } from "../utilities/checkDataType";
import {
    emailFormatRegex,
    passwordFormatRegex,
} from "../utilities/checkAccount";

export const checkGetAccountFields = (
    input: GetAccountFields
): { check: boolean; code: errorCodes } => {
    const { token, id, type } = input;

    const tokenCheck =
        (token != undefined && token != null) ||
        (id != undefined && id != null);
    if (!tokenCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    const typeCheck = type != null && type && type != userType.undefined;
    if (!typeCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    return {
        check: tokenCheck && typeCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkEditAccountFields = (
    input: EditAccountFields
): { check: boolean; code: errorCodes } => {
    const { email, password, phone, direction } = input;

    const emailCheck =
        email == undefined ||
        email == null ||
        (email != null && emailFormatRegex.test(email) && email.length < 254);
    if (!emailCheck) {
        return { check: false, code: errorCodes.EMAIL_FORMAT_ERROR };
    }
    const passwordCheck =
        password == undefined ||
        password == null ||
        (password != null &&
            password.length < 128 &&
            passwordFormatRegex.test(password));
    if (!emailCheck) {
        return { check: false, code: errorCodes.PASSWORD_FORMAT_ERROR };
    }
    const phoneCheck =
        phone == undefined ||
        phone == null ||
        (phone != null && phone.length < 16 && phoneFormatRegex.test(phone));
    if (!emailCheck) {
        return { check: false, code: errorCodes.PHONE_FORMAT_ERROR };
    }
    let directionCheck: boolean = true;
    direction?.forEach((element) => {
        directionCheck =
            directionCheck &&
            element.commune != null &&
            !isNaN(element.commune) &&
            element.region != null &&
            !isNaN(element.region) &&
            element.street != null &&
            element.streetNumber != null &&
            !isNaN(element.streetNumber);
    });
    if (!directionCheck) {
        return { check: false, code: errorCodes.DIRECTION_FORMAT_ERROR };
    }

    return {
        check: emailCheck && passwordCheck && phoneCheck && directionCheck,
        code: errorCodes.SUCCESFULL,
    };
};
