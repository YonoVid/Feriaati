import {
    AccountData,
    AccountDirection,
    ContributorLevel,
    userStatus,
    userType,
} from "./accountTypes";
import {
    DayTimeRange,
    FactureStatus,
    ProductDiscount,
    ProductFactureData,
    ProductUnit,
} from "./productTypes";
import { DayTime } from "./productTypes";

export type UserRequestFields = {
    token?: string;
    id?: string;
    email: string;
};

export type AccountFields = {
    email: string;
    password: string;
    status?: userStatus;
};

export type GetAccountFields = UserRequestFields & {
    type: userType;
};

export type GetVendorAccountFields = GetAccountFields & {
    permissions: ContributorLevel;
};

export type SubscriptionFields = GetAccountFields & {
    amount: number;
    months: number;
};

export type EditAccountFields = Partial<AccountData> &
    UserRequestFields & {
        updateEmail?: string;
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

export type RegisterContributorFields = UserRequestFields &
    AccountFields & {
        name: string;
        surname: string;
        permission: ContributorLevel;
        confirmPassword?: string;
        token: string;
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

export type LogoutFields = {
    type: userType;
    token: string;
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
    token: string;
    itemId: string;
    status: userStatus;
};

export type ProductFields = {
    tokenVendor?: string;
    name: string;
    description: string;
    unitType: ProductUnit;
    unit?: number;
    price: number;
    discount: ProductDiscount;
    promotion?: number;
    image: [string, string, string] | string;
};

export type ProductListFields = UserRequestFields & {
    idProducts?: string;
};

export type ProductDeleteFields = ProductListFields & {
    idProducts: string;
};

export type ProductEditFields = ProductFields & {
    id: string;
};

export enum FactureTypes {
    PRODUCTS = "products",
    SUBSCRIPTION = "subscription",
}

export type UpdateFactureFields = {
    token: string;
    userType: userType;
    facture: string;
    status: FactureStatus;
    type: FactureTypes;
};

export type ProductFactureFields = {
    token: string;
    direction?: AccountDirection;
    products: { [id: string]: ProductFactureData[] };
};

export type ProductSubscriptionFields = {
    token: string;
    priceTotal: number;
    type: userType;
};

export type UpdateProductVendorFields = UserRequestFields & {
    productVendorId: string;
    image?: string;
    serviceTime?: { start: DayTime; end: DayTime };
    contactPhone?: string;
    contactEmail?: string;
};

export type UpdateFullProductVendorFields = {
    adminToken: string;
    id: string;
    enterpriseName?: string;
    rut?: string;
    localNumber?: number;
    region?: number;
    commune?: number;
    street?: string;
    streetNumber?: number;
    image?: string;
    serviceTime?: DayTimeRange;
    contact?: { phone: string; email: string };
};

export type UpdateFullVendorFields = {
    adminToken: string;
    id: string;
    email?: string;
    password?: string;
    name?: string;
    surname?: string;
};

export type UpdateFullUserFields = {
    adminToken: string;
    id: string;
    email?: string;
    password?: string;
    username?: string;
};

export type UpdateContributorFields = UserRequestFields & {
    contributorId: string;
    productsId: string;
    name?: string;
    surname?: string;
    password?: string;
    confirmPassword?: string;
    permission?: ContributorLevel;
};

export type DeleteFields = UserRequestFields & {
    itemId: string;
};

export type ResumeFields = UserRequestFields & {
    year: number;
};

export type FactureFields = UserRequestFields & {
    index: number;
    size: number;
};
