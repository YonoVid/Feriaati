import { LogicalData, TimeDate } from "./sharedTypes";

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
    subscription?: ActualSubscription;
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

export enum SubscriptionStatus {
    APPROVED = "approved",
    PROCESSING = "processing",
    CANCELED = "canceled",
    EXPIRED = "expired",
}

export type ActualSubscription = {
    expiration: TimeDate;
    renovation: boolean;
};

export type SubscriptionCollectionData = {
    amount: number;
    expiration: TimeDate;
    date: TimeDate;
    type: userType;
    status: SubscriptionStatus;
    user: string;
};

export type SubscriptionData = {
    amountBase: number;
    amountYear: number;
    expirationDate?: TimeDate;
    type: userType;
};
