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

export enum OpinionValue {
    NONE = -1,
    POSITIVE = 0,
    NEGATIVE = 1,
}

export type CommentFields = {
    userToken?: string;
    vendorId?: string;
    comment: string;
    opinion: OpinionValue;
};

export type UserComment = {
    id?: string;
    userId: string;
    username?: string;
    comment: string;
    opinion: OpinionValue;
};

export type UserCommentList = {
    own: UserComment;
    comments: Array<UserComment>;
};

export type CommentCollectionData = UserComment & {
    date: Date;
    reports?: number;
};
