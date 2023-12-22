import { ProductFactureFields, UpdateFullUserFields } from "../model/types";
import { errorCodes } from "../errors";
import { checkDirection } from "../account/checkAccount";

export const checkUserFullUpdate = (
    input: UpdateFullUserFields
): { check: boolean; code: errorCodes } => {
    const { adminToken, id, email, password, username } = input;

    //Check required values exist
    const requiredCheck =
        adminToken != null &&
        adminToken != "" &&
        id != null &&
        id != "" &&
        ((email != "" && email != null) ||
            (password != "" && password != null) ||
            (username != "" && username != null));
    if (!requiredCheck) {
        return {
            check: false,
            code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
        };
    }
    return {
        check: requiredCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkBuyProduct = (
    input: ProductFactureFields
): { check: boolean; code: errorCodes } => {
    const { token, direction, products } = input;

    //Check required values exist
    const requiredCheck =
        token != null &&
        token != "" &&
        (products != null || Object.keys(products).length > 0);
    if (!requiredCheck) {
        return {
            check: false,
            code: errorCodes.MISSING_REQUIRED_DATA_ERROR,
        };
    }
    const directionCheck =
        direction == undefined || direction == null
            ? true
            : direction != undefined && checkDirection(direction);
    if (!directionCheck) {
        return {
            check: false,
            code: errorCodes.DIRECTION_FORMAT_ERROR,
        };
    }

    return {
        check: requiredCheck && directionCheck,
        code: errorCodes.SUCCESFULL,
    };
};
