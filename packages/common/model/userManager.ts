import { userStatus } from "./fields/registerFields";

export type UpdateStateFields = {
    id: string;
    email: string;
    state: userStatus;
};
