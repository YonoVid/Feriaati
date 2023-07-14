import { userType } from "../functionsTypes";

export type LoginFields = {
    email: string;
    password: string;
    attempts?: number;
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

export type LogoutFields = {
    type: userType;
    token: string;
};
