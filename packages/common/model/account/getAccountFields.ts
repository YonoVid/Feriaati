import { UserRequestFields } from "../fields/fields";
import { userType } from "../functionsTypes";

export type GetAccountFields = UserRequestFields & {
    type: userType;
};
