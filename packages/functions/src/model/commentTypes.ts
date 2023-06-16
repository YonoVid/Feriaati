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

export type UserComment = {
    id?: string;
    userId: string;
    username?: string;
    comment: string;
};

export type CommentCollectionData = UserComment & {
    date: Date;
    reports?: number;
};
