import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";
import { emailFormatRegex } from "./checkLoginFields";
import { phoneFormatRegex } from "./checkAccountFields";
import {
    UpdateFullUserFields,
    UpdateFullVendorFields,
} from "../model/fields/adminFields";
import { passwordFormatRegex } from "./checkBase";

export const checkAccountFullUpdate = (
    input: UpdateFullUserFields
): boolean => {
    const { adminToken, id, email, password, username } = input;

    const requiredCheck =
        adminToken !== "" &&
        adminToken != null &&
        id !== "" &&
        id != null &&
        (email !== "" ||
            email != null ||
            password !== "" ||
            password != null ||
            username !== "" ||
            username != null);

    const formatCheck =
        (email == null || email == undefined || emailFormatRegex.test(email)) &&
        (password == null ||
            password == undefined ||
            passwordFormatRegex.test(password));

    return requiredCheck && formatCheck;
};

export const checkVendorFullUpdate = (
    input: UpdateFullVendorFields
): boolean => {
    const { adminToken, id, email, password, name, surname } = input;

    // Check required values exist
    const requiredCheck =
        adminToken != null &&
        adminToken != "" &&
        id != null &&
        id != "" &&
        ((email != "" && email != null) ||
            (password != "" && password != null) ||
            (name != "" && name != null) ||
            (surname != "" && surname != null));

    return requiredCheck;
};
