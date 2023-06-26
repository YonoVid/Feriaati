import { errorCodes } from "../errors";
import { UpdatePassFields } from "../model/types";

export const checkUpdatePassFields = (
    input: UpdatePassFields
): { check: boolean; code: errorCodes } => {
    const { codigo, password, confirmPassword } = input;

    const codeCheck = codigo != null;
    if (!codeCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }

    // console.log("Email check", emailCheck);
    const passwordCheck = password != null && password.length < 128;
    if (!passwordCheck) {
        return { check: false, code: errorCodes.PASSWORD_FORMAT_ERROR };
    }
    // console.log("Password check", passwordCheck);

    const passwordConfirmCheck = password === confirmPassword;
    if (!passwordConfirmCheck) {
        return { check: false, code: errorCodes.CONFIRM_PASSWORD_ERROR };
    }
    // console.log("Password check", passwordCheck);

    return {
        check: codeCheck && passwordCheck && passwordConfirmCheck,
        code: errorCodes.SUCCESFULL,
    };
};
