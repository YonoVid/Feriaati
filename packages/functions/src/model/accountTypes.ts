import { collectionNames } from "../consts";
import { LogicalData, TimeDate } from "./sharedTypes";

export enum userType {
    admin = "admin",
    user = "user",
    vendor = "vendor",
    contributor = "contributor",
    temp = "temp",
    undefined = "undefined",
}

export const UserCollection: { [type in userType]: collectionNames } = {
    [userType.user]: collectionNames.USERS,
    [userType.vendor]: collectionNames.VENDORS,
    [userType.admin]: collectionNames.ADMINS,
    [userType.contributor]: collectionNames.VENDORS,
    [userType.temp]: collectionNames.USERS,
    [userType.undefined]: collectionNames.USERS,
};

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

export type AccountUser = {
    id?: string;
    type: userType;
    email: string;
    password: string;
    creationDate: Date;
    status: string;
    token?: string;
};

export type AccountData = AccountUser & {
    phone?: string;
    direction?: Array<AccountDirection>;
    subscription?: ActualSubscription;
};

export type PasswordData = {
    password: string;
    algorithm: string;
    iv: ArrayBuffer;
    code?: string;
};

export type AccountCollectionData = LogicalData & AccountData & PasswordData;

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

export enum ContributorLevel {
    MANAGER = "manager",
    CASHIER = "cashier",
    VIEWER = "viewer",
}

export type ContributorData = AccountUser & {
    name: string;
    surname: string;
    permissions: ContributorLevel;
    productsId: string;
};

export type ContributorCollectionData = LogicalData &
    ContributorData &
    PasswordData;

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
