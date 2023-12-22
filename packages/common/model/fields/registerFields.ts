import { ContributorLevel } from "../functionsTypes";
import { UserRequestFields } from "./fields";

export enum userStatus {
    registered = "registered",
    activated = "activated",
    blocked = "blocked",
}

export type AccountFields = {
    email: string;
    password: string;
    status?: userStatus;
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
    image: string | ArrayBuffer;
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
