import { UpdatePassFields } from "@feria-a-ti/common/model/fields/updateFields";
import { passwordFormatRegex } from "./checkBase";

export const checkUpdatePassFields = (input: UpdatePassFields): boolean => {
    const { codigo, password, confirmPassword } = input;

    const codeCheck = codigo != null;
    // console.log("Email check", emailCheck);
    const passwordCheck =
        password != null &&
        password.length < 128 &&
        passwordFormatRegex.test(password);
    // console.log("Password check", passwordCheck);

    const passwordConfirmCheck = password === confirmPassword;
    // console.log("Password check", passwordCheck);

    return codeCheck && passwordCheck && passwordConfirmCheck;
};
