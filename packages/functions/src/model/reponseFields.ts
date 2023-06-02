import { userStatus, userType } from "./accountTypes";

export type ResponseData<T> = {
    error: boolean;
    code: string;
    msg: string;
    extra?: T | any;
};

export type UserToken = {
    email: string;
    token: string;
    type: userType;
};

export type UpdateStateFields = {
    id: string;
    email: string;
    status: userStatus;
};
