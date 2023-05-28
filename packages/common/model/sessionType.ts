import { UserToken, userType } from "./functionsTypes";

export type SessionUserData = {
    type: userType;
    authUser: string | undefined;
    authToken: string | undefined;
    setSession: (data: UserToken) => void;
    resetSession: () => void;
    checkSession: () => boolean;
};
