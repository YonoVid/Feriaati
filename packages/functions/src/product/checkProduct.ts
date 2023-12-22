import {
    ProductFields,
    ProductListFields,
    UpdateFullProductVendorFields,
    UpdateProductVendorFields,
} from "../model/types";
import { errorCodes } from "../errors";
import {
    emailFormatRegex,
    numberRegex,
    phoneFormatRegex,
} from "../utilities/checkDataType";
import { DayTimeRange, ProductUnit } from "../model/productTypes";
// import { numberRegex } from "../utilities/checkDataType";

export const checkAddProductFields = (
    input: ProductFields
): { check: boolean; code: errorCodes } => {
    const {
        name,
        description,
        price,
        discount,
        promotion,
        image,
        unit,
        unitType,
    } = input;
    // Check required values exist
    const requiredCheck =
        name != null &&
        description != null &&
        price != null &&
        image != null &&
        unitType != null;
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    const priceCheck =
        price == null ||
        price == undefined ||
        !isNaN(price) ||
        (price > 0 && numberRegex.test(price.toString()));
    if (!priceCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    }

    const unitCheck =
        unitType !== ProductUnit.GRAM ||
        (unit != undefined && unit != null && (unit as number) > 0);
    if (!unitCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
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
        check: requiredCheck && priceCheck && discountCheck && unitCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkProductListFields = (
    input: ProductListFields
): { check: boolean; code: errorCodes } => {
    const { token, email, idProducts } = input;
    // Check required values exist
    const requiredCheck =
        (idProducts != null && idProducts != "") ||
        (token != "" && token != null && email != "" && email != null);
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
        token,
        email,
        productVendorId,
        image,
        serviceTime,
        contactPhone,
        contactEmail,
    } = input;

    const requiredCheck =
        token != undefined &&
        token != null &&
        email != undefined &&
        email != null &&
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

export const checkProductVendorFullUpdate = (
    input: UpdateFullProductVendorFields
): { check: boolean; code: errorCodes } => {
    const {
        adminToken,
        id,
        enterpriseName,
        rut,
        localNumber,
        street,
        streetNumber,
        region,
        commune,
        contact,
        serviceTime,
        image,
    } = input;

    const { check, code } = checkProductVendorUpdate({
        token: "ignore",
        email: "ignore",
        productVendorId: "ignore",
        image: image || undefined,
        serviceTime: serviceTime || undefined,
        contactPhone: contact?.phone || undefined,
        contactEmail: contact?.email || undefined,
    });
    if (!check) {
        // Check required values exist
        const requiredCheck =
            adminToken != null &&
            adminToken != "" &&
            id != null &&
            id != "" &&
            ((enterpriseName != "" && enterpriseName != null) ||
                (rut != "" && rut != null) ||
                (street != "" && street != null) ||
                (!isNaN(localNumber as number) && localNumber != null) ||
                (!isNaN(streetNumber as number) && streetNumber != null) ||
                (!isNaN(commune as number) && commune != null) ||
                (!isNaN(region as number) && region != null));
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
    }
    return { check: check, code: code };
};
