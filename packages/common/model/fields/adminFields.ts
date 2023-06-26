import { userStatus } from "@feria-a-ti/common/model/functionsTypes";

export type UpdateStateFields = {
    id: string;
    email: string;
    status: userStatus;
};
