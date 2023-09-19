import { UpdateFullUserFields } from "../model/types";
import { errorCodes } from "../errors";

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
