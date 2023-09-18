import { UserRequestFields } from "./fields";

export type FactureFields = UserRequestFields & {
    index: number;
    size: number;
};
