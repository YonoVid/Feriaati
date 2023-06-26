import { errorCodes } from "../errors";
import { RegisterFields } from "../model/types";
import { checkAccountFields } from "../utilities/checkAccount";

export const checkRegisterFields = (
    input: RegisterFields
): { check: boolean; code: errorCodes } => {
    const { username, email, password, confirmPassword } = input;

    const { check: accountCheck, code: accountCode } = checkAccountFields({
        email: email,
        password: password,
    });
    if (accountCheck) {
        return { check: accountCheck, code: accountCode };
    }

    const userCheck = username != null && username.length < 18;
    if (!userCheck) {
        return { check: false, code: errorCodes.NAME_FORMAT_ERROR };
    }
    // console.log("Username check", userCheck);
    const passwordCheck = password === confirmPassword;
    if (!passwordCheck) {
        return { check: false, code: errorCodes.CONFIRM_PASSWORD_ERROR };
    }
    // console.log("Password check", passwordCheck);

    return {
        check: userCheck && accountCheck && passwordCheck,
        code: errorCodes.SUCCESFULL,
    };
};
