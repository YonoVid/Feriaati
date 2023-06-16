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
};
