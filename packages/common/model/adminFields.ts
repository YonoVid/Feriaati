import { userStatus } from "./functionsTypes";

export type UpdateStateFields = {
    id: string;
    email: string;
    status: userStatus;
};
