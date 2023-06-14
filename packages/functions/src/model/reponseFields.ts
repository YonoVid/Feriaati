import { userStatus, userType } from "./accountTypes";
import { ProductCollectionData } from "./productTypes";

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

export type ProductData = ProductCollectionData & {
    id: string;
};
