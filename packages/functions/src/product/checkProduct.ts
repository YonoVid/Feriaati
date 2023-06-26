import {
    ProductFields,
    ProductListFields,
    UpdateProductVendorFields,
} from "../model/types";
import { errorCodes } from "../errors";
import { emailFormatRegex, phoneFormatRegex } from "../utilities/checkDataType";
import { DayTimeRange } from "../model/productTypes";
// import { numberRegex } from "../utilities/checkDataType";

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
    // !TODO Fix numeric check of price
    // let stringPrice: string = price.toString();
    // const stringTest: string = stringPrice.replace(/["']+/g, "");
    // const priceCheck =
    //     price === null || price === 0 || numberRegex.test(stringTest);
    // if (!priceCheck) {
    //     return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    // }
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

export const checkTimeRange = (serviceTime: DayTimeRange): boolean => {
    return (
        (serviceTime.start.hours < 24 &&
            serviceTime.end.hours < 24 &&
            serviceTime.start.hours >= 0 &&
            serviceTime.end.hours >= 0 &&
            serviceTime.start.hours < serviceTime.end.hours) ||
        (serviceTime.start.hours === serviceTime.end.hours &&
            serviceTime.start.minutes < serviceTime.end.minutes)
    );
};

export const checkProductVendorUpdate = (
    input: UpdateProductVendorFields
): { check: boolean; code: errorCodes } => {
    const {
        tokenVendor,
        productVendorId,
        image,
        serviceTime,
        contactPhone,
        contactEmail,
    } = input;

    const requiredCheck =
        tokenVendor != undefined &&
        tokenVendor != null &&
        productVendorId != undefined &&
        productVendorId != null &&
        ((image != undefined && image != null && image != "") ||
            (serviceTime != undefined && serviceTime != null) ||
            (contactPhone != undefined && contactPhone != null) ||
            (contactEmail != undefined && contactEmail != null));
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    const serviceTimeCheck =
        serviceTime != undefined
            ? serviceTime.start != null &&
              serviceTime.end != null &&
              checkTimeRange(serviceTime)
            : true;
    if (!serviceTimeCheck) {
        return { check: false, code: errorCodes.TIME_FORMAT_ERROR };
    }

    const contactCheckPhone =
        contactPhone != undefined
            ? contactPhone != null && phoneFormatRegex.test(contactPhone)
            : true;
    if (!contactCheckPhone) {
        return { check: false, code: errorCodes.PHONE_FORMAT_ERROR };
    }

    const contactCheckEmail =
        contactEmail != undefined
            ? contactEmail != null && emailFormatRegex.test(contactEmail)
            : true;
    if (!contactCheckEmail) {
        return { check: false, code: errorCodes.EMAIL_FORMAT_ERROR };
    }
    return {
        check:
            requiredCheck &&
            serviceTimeCheck &&
            contactCheckEmail &&
            contactCheckPhone,
        code: errorCodes.SUCCESFULL,
    };
};
