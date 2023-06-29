import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";

export type SessionUserData = {
    type: userType;
    authUser: string | undefined;
    authToken: string | undefined;
    productQuantity: number;
    setProductQuantity: (quantity: number) => void;
    setSession: (data: UserToken) => void;
    resetSession: () => void;
    checkSession: () => boolean;
};

export type UIMessages = {
    setMessage: (data: { msg: string; isError: boolean }) => void;
};
