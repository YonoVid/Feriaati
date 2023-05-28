import { userStatus, userType } from "./accountTypes";

export type AccountFields = {
    email: string;
    password: string;
    status?: userStatus;
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