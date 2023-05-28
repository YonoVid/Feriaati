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

export type AccountCollectionData = {
    type: userType;
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
    image: string;
};
