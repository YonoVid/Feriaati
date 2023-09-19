export enum OpinionValue {
    NONE = -1,
    POSITIVE = 0,
    NEGATIVE = 1,
}

export type GetCommentsFields = {
    token?: string;
    id?: string;
    max?: number;
};

export type ReportCommentFields = {
    userToken: string;
    commentId?: string;
    vendorId?: string;
};

export type CommentFields = {
    userToken?: string;
    vendorId?: string;
    comment: string;
    opinion: OpinionValue;
};
