import { UserRequestFields } from "../fields/fields";
import { AccountData, userType } from "../functionsTypes";

export type AccountDirection = {
    type?: "house" | "department" | "";
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    extra?: string;
};

export type EditAccountFields = Partial<AccountData> &
    UserRequestFields & {
        updateEmail?: string;
    };

export type EditFormAccountFields = EditAccountFields & {
    confirmPassword: string;
    type: userType;
};
