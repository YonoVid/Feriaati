import { errorCodes } from "../errors";
import { FactureFields, ResumeFields } from "../model/types";

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

export const checkResumeFields = (
    input: ResumeFields
): { check: boolean; code: errorCodes } => {
    const { year } = input;

    const numericCheck = !isNaN(year);
    if (!numericCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    }

    const positiveCheck = year >= 0;
    if (!positiveCheck) {
        return { check: false, code: errorCodes.INCORRECT_INTEGER_FORMAT };
    }

    return {
        check: numericCheck && positiveCheck,
        code: errorCodes.SUCCESFULL,
    };
};
