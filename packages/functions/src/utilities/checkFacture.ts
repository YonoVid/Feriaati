import { errorCodes } from "../errors";
import { FactureFields } from "../model/types";

export const checkFactureFields = (
    input: FactureFields
): { check: boolean; code: errorCodes } => {
    const { index, size } = input;

    const numericCheck = !isNaN(index) && !isNaN(size);
    if (!numericCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    }

    const positiveCheck = index >= 0 && size >= 0;
    if (!positiveCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    }

    return {
        check: numericCheck && positiveCheck,
        code: errorCodes.SUCCESFULL,
    };
};
