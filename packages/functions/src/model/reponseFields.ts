import { userStatus, userType, VendorCollectionData } from "./accountTypes";
import {
    ProductCollectionData,
    ProductListCollectionData,
} from "./productTypes";

export type ResponseData<T> = {
    error: boolean;
    code: string;
    msg: string;
    extra?: T | any;
};

export type UserToken = {
    id: string;
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

export type ProductListData = ProductListCollectionData & {
    id: string;
};

export type VendorData = VendorCollectionData & {
    id: string;
};
