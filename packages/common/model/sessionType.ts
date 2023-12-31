import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";

export type SessionUserData = {
    type: userType;
    authUser: string | undefined;
    emailUser: string | undefined;
    authToken: string | undefined;
    setSession: (data: UserToken) => void;
    resetSession: () => void;
    checkSession: () => boolean;
};

export type RSessionUserData = SessionUserData & {
    productQuantity: number;
    setProductQuantity: (quantity: number) => void;
};

export type MessageData = { msg: string; isError: boolean };

export type UIMessages = {
    setMessage: (data: MessageData) => void;
};
