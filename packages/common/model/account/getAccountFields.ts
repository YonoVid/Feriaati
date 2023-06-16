import { userType } from "../functionsTypes";

export type GetAccountFields = {
    token?: string;
    id?: string;
    type: userType;
};
