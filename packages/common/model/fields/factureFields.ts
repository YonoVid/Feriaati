import { UserRequestFields } from "./fields";

export type FactureFields = UserRequestFields & {
    index: number;
    size: number;
};

export type ResumeFields = UserRequestFields & {
    year: number;
};
