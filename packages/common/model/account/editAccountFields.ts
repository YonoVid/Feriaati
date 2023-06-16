import { AccountData, userType } from "../functionsTypes";

export type AccountDirection = {
    type?: "house" | "department" | "";
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    extra?: string;
};

export type EditAccountFields = Partial<AccountData> & {
    token?: string;
    id?: string;
};

export type EditVendorAccountFields = EditAccountFields & {
    confirmPassword: string;
    type: userType;
};
