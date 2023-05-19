export enum userStatus {
    registered = "registered",
    activated = "activated",
    blocked = "blocked",
}

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

export type AccountCollectionData = {
    email: string;
    password: string;
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
};

export type ResponseData = {
    email: string;
    error: boolean;
    code: string;
    msg: string;
    extra?: any;
};
