import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { AccountData, userType } from "../model/functionsTypes";
import { emailFormatRegex, passwordFormatRegex } from "./checkRegisterFields";

export const phoneFormatRegex = new RegExp(
    /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
);

export const checkGetAccountFields = (input: GetAccountFields): boolean => {
    const { token, id, type } = input;

    const tokenCheck =
        (token != undefined && token != null) ||
        (id != undefined && id != null);

    const typeCheck = type != null && type && type != userType.undefined;
    // console.log("Password check", passwordCheck);

    return tokenCheck && typeCheck;
};

export const checkEditAccountFields = (
    input: Partial<AccountData>
): boolean => {
    const { email, password, phone, direction } = input;
    const emailCheck =
        email == undefined ||
        email == null ||
        (email != null && emailFormatRegex.test(email) && email.length < 254);
    // console.log("Email check", emailCheck);
    const passwordCheck =
        password == undefined ||
        password == null ||
        (password != null &&
            password.length < 128 &&
            passwordFormatRegex.test(password));
    // console.log("Password check", passwordCheck);
    const phoneCheck =
        phone == undefined ||
        phone == null ||
        (phone != null && phone.length < 16 && phoneFormatRegex.test(phone));

    let directionCheck: boolean = true;
    direction?.forEach((element) => {
        directionCheck =
            directionCheck &&
            element.commune != null &&
            !isNaN(element.commune) &&
            element.region != null &&
            !isNaN(element.region) &&
            element.street != null &&
            element.streetNumber != null &&
            !isNaN(element.streetNumber);
    });

    return emailCheck && passwordCheck && phoneCheck && directionCheck;
};
