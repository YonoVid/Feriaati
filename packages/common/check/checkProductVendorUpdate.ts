import {
    DayTimeRange,
    UpdateProductVendorFields,
} from "@feria-a-ti/common/model/fields/updateFields";
import { emailFormatRegex } from "./checkLoginFields";
import { phoneFormatRegex } from "./checkAccountFields";
import { UpdateFullProductVendorFields } from "../model/fields/adminFields";

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
): boolean => {
    const {
        token,
        email,
        productVendorId,
        image,
        serviceTime,
        contactEmail,
        contactPhone,
    } = input;

    const requiredCheck =
        token != undefined &&
        token != null &&
        email != undefined &&
        email != null &&
        productVendorId != undefined &&
        productVendorId != null &&
        ((image != undefined && image != null) ||
            (serviceTime != undefined && serviceTime != null) ||
            (contactPhone != undefined && contactPhone != null) ||
            (contactEmail != undefined && contactEmail != null));

    const serviceTimeCheck =
        serviceTime != undefined
            ? serviceTime.start != null &&
              serviceTime.end != null &&
              checkTimeRange(serviceTime)
            : true;

    const contactCheckPhone =
        contactPhone != undefined
            ? contactPhone != null && phoneFormatRegex.test(contactPhone.trim())
            : true;

    const contactCheckEmail =
        contactEmail != undefined
            ? contactEmail != null && emailFormatRegex.test(contactEmail.trim())
            : true;

    return (
        requiredCheck &&
        serviceTimeCheck &&
        contactCheckPhone &&
        contactCheckEmail
    );
};

export const checkProductVendorFullUpdate = (
    input: UpdateFullProductVendorFields
): boolean => {
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

    const check = checkProductVendorUpdate({
        token: "ignore",
        email: "ignore",
        productVendorId: "ignore",
        image: image || undefined,
        serviceTime: serviceTime || undefined,
        contactPhone: contact?.phone || undefined,
        contactEmail: contact?.email || undefined,
    });
    if (!check) {
        //Check required values exist
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

        return requiredCheck;
    }
    return check;
};
