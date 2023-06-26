import { DayTime } from "../baseTypes";

export type UpdatePassFields = {
    email: string;
    codigo: string;
    password: string;
    confirmPassword: string;
};

export type DayTimeRange = { start: DayTime; end: DayTime };

export type UpdateProductVendorFields = {
    tokenVendor?: string;
    productVendorId: string;
    image?: string;
    serviceTime?: DayTimeRange;
    contactPhone?: string;
    contactEmail?: string;
};
