import { LogicalData } from "./sharedTypes";

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

export type AccountCollectionData = LogicalData &
    AccountData & {
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
    productsId: string | undefined;
};
