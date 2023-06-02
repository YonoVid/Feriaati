import { ProductFields, ProductListFields } from "../model/types";
import { errorCodes } from "../errors";

export const checkAddProductFields = (
    input: ProductFields
): { check: boolean; code: errorCodes } => {
    const { name, description, price, discount, promotion, image } = input;
    //Check required values exist
    const requiredCheck =
        name != null && description != null && price != null && image != null;
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    const discountCheck =
        discount === "none" ||
        (discount != null &&
            promotion != null &&
            (promotion as number) > 0 &&
            ((discount === "percentage" && promotion <= 100) ||
                (discount === "value" && (promotion as number) <= price)));
    if (!discountCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkProductListFields = (
    input: ProductListFields
): { check: boolean; code: errorCodes } => {
    const { idVendor, tokenVendor } = input;
    //Check required values exist
    const requiredCheck =
        (idVendor != null && idVendor != "") ||
        (tokenVendor != "" && tokenVendor != null);
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck,
        code: errorCodes.SUCCESFULL,
    };
};
