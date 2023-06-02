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

export type AccountCollectionData = {
    type: "admin" | "user" | "vendor" | "temp";
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

export type ProductListCollectionData = {
    vendorId: string;
    products: Array<ProductCollectionData>;
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    isPercentage: boolean;
    promotion: number;
    image: [string, string, string];
};
