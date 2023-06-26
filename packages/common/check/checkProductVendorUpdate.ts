import {
    DayTimeRange,
    UpdateProductVendorFields,
} from "@feria-a-ti/common/model/fields/updateFields";
import { emailFormatRegex } from "./checkLoginFields";
import { phoneFormatRegex } from "./checkAccountFields";

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
        tokenVendor,
        productVendorId,
        image,
        serviceTime,
        contactEmail,
        contactPhone,
    } = input;

    const requiredCheck =
        tokenVendor != undefined &&
        tokenVendor != null &&
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
