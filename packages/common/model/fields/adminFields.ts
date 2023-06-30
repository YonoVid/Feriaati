import { userStatus } from "@feria-a-ti/common/model/functionsTypes";
import { DayTimeRange } from "./updateFields";

export type UpdateStateFields = {
    id: string;
    email: string;
    status: userStatus;
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

export type FormUpdateFullProductVendorFields = {
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
    contactPhone?: string;
    contactEmail?: string;
};
export type DeleteProductVendorFields = {
    adminToken: string;
    productVendorId: string;
};
