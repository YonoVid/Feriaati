import { EditAccountFields, GetAccountFields } from "../model/types";
import { AccountDirection, userType } from "../model/accountTypes";
import { errorCodes } from "../errors";
import { emailFormatRegex, phoneFormatRegex } from "../utilities/checkDataType";
import { passwordFormatRegex } from "../utilities/checkAccount";
import { validateAddress } from "../utilities/directionValidation";

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

export const checkEditAccountFields = async (
    input: EditAccountFields
): Promise<{ check: boolean; code: errorCodes }> => {
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
    let directionCheck = true;
    if (direction) {
        for (const element of direction) {
            directionCheck = directionCheck && (await checkDirection(element));
            if (!directionCheck) break;
        }
    } else {
        directionCheck = false;
    }
    if (!directionCheck) {
        return { check: false, code: errorCodes.DIRECTION_FORMAT_ERROR };
    }

    return {
        check: emailCheck && passwordCheck && phoneCheck && directionCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkDirection = async (data: AccountDirection) => {
    if (
        data.commune != null &&
        !isNaN(data.commune) &&
        data.region != null &&
        !isNaN(data.region) &&
        data.street != null &&
        data.streetNumber != null &&
        !isNaN(data.streetNumber)
    ) {
        return await validateAddress(data);
    }

    return false;
};
