import { AccountData, userStatus, userType } from "./accountTypes";
import { DayTimeRange, ProductDiscount, ProductUnit } from "./productTypes";
import { DayTime } from "./productTypes";

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

export type UpdateProductVendorFields = {
    tokenVendor?: string;
    productVendorId: string;
    image?: string;
    serviceTime?: { start: DayTime; end: DayTime };
    contactPhone?: string;
    contactEmail?: string;
};

export type UpdateFullProductVendorFields = {
    adminToken: string;
    id: string;
    vendorId?: string;
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

export type DeleteProductVendorFields = {
    adminToken: string;
    productVendorId: string;
};
