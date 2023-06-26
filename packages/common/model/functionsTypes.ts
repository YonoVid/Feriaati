import { DayTime } from "./baseTypes";

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

//
// VENDOR PAGE TYPES
//

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

//
// ACCOUNTS RELATED TYPES
//

export enum userType {
    admin = "admin",
    user = "user",
    vendor = "vendor",
    temp = "temp",
    undefined = "undefined",
}

export enum userStatus {
    registered = "registered",
    activated = "activated",
    blocked = "blocked",
}

export type AccountDirection = {
    type?: "house" | "department" | "";
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    extra?: string;
};

export type AccountData = {
    type: userType;
    email: string;
    password: string;
    phone?: string;
    direction?: Array<AccountDirection>;
};

export type AccountCollectionData = AccountData & {
    algorithm: string;
    status: string;
    iv: ArrayBuffer;
    code: string;
};

export type UserCollectionData = AccountCollectionData & {
    username: string;
};

export type VendorCollectionData = AccountCollectionData & {
    rut: string;
    enterpriseName: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    name: string;
    surname: string;
    image: string;
};

export type ProductListCollectionData = {
    vendorId: string;
    enterpriseName: string;
    rut: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    image: string;
    products: Array<ProductCollectionData>;
    serviceTime?: { start: DayTime; end: DayTime };
    contact?: { phone: string; email: string };
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion: number;
    image: [string, string, string];
};

export type ProductData = ProductCollectionData & {
    id: string;
};
