import { RegisterContributorFields } from "../model/fields/registerFields";
import { UpdateContributorFields } from "../model/fields/updateFields";
import { checkAccountFields } from "./checkRegisterFields";

export const checkContributorAdd = (input: RegisterContributorFields) => {
    const { email, password, token, id } = input;
    //Check required values exist
    const requiredCheck =
        email != null && password != null && (token != null || id != null);

    const accountCheck = checkAccountFields({
        email: email,
        password: password,
    });

    return requiredCheck && accountCheck;
};

export const checkContributorEdit = (input: UpdateContributorFields) => {
    const {
        name,
        surname,
        password,
        confirmPassword,
        permission,
        productsId,
        token,
        id,
    } = input;
    //Check required values exist
    const requiredCheck =
        productsId != null &&
        (token != null || id != null) &&
        (name != null ||
            password != null ||
            surname != null ||
            permission != null);

    const optionalCheck =
        (name != null || name == undefined) &&
        (surname != null || surname == undefined) &&
        (password != null || password == undefined) &&
        (permission != null || permission == undefined);

    const passwordCheck =
        password == undefined ||
        password == null ||
        password === confirmPassword;

    return requiredCheck && optionalCheck && passwordCheck;
};
