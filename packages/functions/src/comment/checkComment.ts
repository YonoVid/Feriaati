import { errorCodes } from "../errors";
import {
    CommentFields,
    GetCommentsFields,
    OpinionValue,
    ReportCommentFields,
} from "../model/commentTypes";
import { stringRegex } from "../utilities/checkDataType";

export const checkGetCommentsFields = (
    input: GetCommentsFields
): { check: boolean; code: errorCodes } => {
    const { id, token, max } = input;
    // Check required values exist
    const requiredCheck =
        (id != null && id != "") || (token != "" && token != null);
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    const maxCheck =
        !max ||
        max === null ||
        (max != null && max != undefined && !isNaN(max));
    if (!maxCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck && maxCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkReportCommentFields = (
    input: ReportCommentFields
): { check: boolean; code: errorCodes } => {
    const { commentId, userToken, vendorId } = input;
    // Check required values exist
    const requiredCheck =
        vendorId != null &&
        vendorId != "" &&
        userToken != "" &&
        userToken != null &&
        commentId != "" &&
        commentId != null;
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck,
        code: errorCodes.SUCCESFULL,
    };
};

export const checkCommentFields = (
    input: CommentFields
): { check: boolean; code: errorCodes } => {
    const { vendorId, userToken, comment, opinion } = input;
    // Check required values exist
    const requiredCheck =
        vendorId != null &&
        vendorId != "" &&
        userToken != "" &&
        userToken != null &&
        opinion != null;
    if (!requiredCheck) {
        return { check: false, code: errorCodes.MISSING_REQUIRED_DATA_ERROR };
    }
    const commentCheck =
        comment != null &&
        comment != "" &&
        comment.length < 255 &&
        stringRegex.test(comment);
    if (!commentCheck) {
        return { check: false, code: errorCodes.COMMENT_FORMAT_ERROR };
    }

    const opinionCheck = opinion != OpinionValue.NONE;
    if (!opinionCheck) {
        return { check: false, code: errorCodes.COMMENT_FORMAT_ERROR };
    }
    // console.log("Username check", userCheck);
    return {
        check: requiredCheck && commentCheck && opinionCheck,
        code: errorCodes.SUCCESFULL,
    };
};
