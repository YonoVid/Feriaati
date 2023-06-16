import { AccountData, userStatus, userType } from "./accountTypes";

export type AccountFields = {
    email: string;
    password: string;
    status?: userStatus;
};

export type GetAccountFields = {
    token?: string;
    id?: string;
    type: userType;
};

export type EditAccountFields = Partial<AccountData> & {
    token?: string;
    id?: string;
};

export type UserFields = AccountFields & {
    username: string;
};

export type RegisterFields = UserFields & {
    confirmPassword: string;
};

export type RegisterVendorFields = AccountFields & {
    rut: string;
    enterpriseName: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    name: string;
    surname: string;
    confirmPassword: string;
    image: string;
};

export type ConfirmRegisterFields = UserFields & {
    code: string;
};

export type RegisterConfirm = {
    email: string;
    code: string;
};

export type LoginFields = {
    email: string;
    password: string;
    attempts: number;
};
export type RecoveryFields = {
    email: string;
};

export type UpdatePassFields = {
    email: string;
    codigo: string;
    password: string;
    confirmPassword: string;
};

export type UpdateStateFields = {
    id: string;
    email: string;
    status: userStatus;
};

export type ProductFields = {
    tokenVendor?: string;
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion?: number;
    image: [string, string, string] | string;
};

export type ProductListFields = {
    tokenVendor?: string;
    idVendor?: string;
};

export type ProductDeleteFields = ProductListFields & {
    productId: string;
};

export type ProductEditFields = ProductFields & {
    id: string;
};
