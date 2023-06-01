import { ProductFields } from "../model/types";
import { errorCodes } from "../errors";

export const checkAddProductFields = (
    input: ProductFields
): { check: boolean; code: errorCodes } => {
    const { name, description, price, isPercentage, promotion, image } = input;
    //Check required values exist
    const requiredCheck =
        name != null &&
        description != null &&
        price != null &&
        isPercentage != null &&
        promotion != null &&
        image != null;
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck,
        code: errorCodes.SUCCESFULL,
    };
};
