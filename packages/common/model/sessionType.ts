import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";

export type SessionUserData = {
    type: userType;
    authUser: string | undefined;
    authToken: string | undefined;
    setSession: (data: UserToken) => void;
    resetSession: () => void;
    checkSession: () => boolean;
};

export type RSessionUserData = SessionUserData & {
    productQuantity: number;
    setProductQuantity: (quantity: number) => void;
};

export type UIMessages = {
    setMessage: (data: { msg: string; isError: boolean }) => void;
};
