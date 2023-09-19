import { userStatus } from "@feria-a-ti/common/model/functionsTypes";
import { DayTimeRange } from "./updateFields";

export type UpdateStateFields = {
    token: string;
    itemId: string;
    status: userStatus;
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

export type FormUpdateFullProductVendorFields = {
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
    contactPhone?: string;
    contactEmail?: string;
};

export type UpdateFullVendorFields = {
    adminToken: string;
    id: string;
    email?: string;
    password?: string;
    name?: string;
    surname?: string;
};

export type FormUpdateFullVendorFields = {
    id: string;
    email?: string;
    password?: string;
    confirmPassword: string;
    name?: string;
    surname?: string;
};

export type UpdateFullUserFields = {
    adminToken: string;
    id: string;
    email?: string;
    password?: string;
    username?: number;
};

export type FormUpdateFullUserFields = {
    id: string;
    email?: string;
    password?: string;
    confirmPassword: string;
    username?: string;
};

export type DeleteFields = {
    token: string;
    itemId: string;
};
