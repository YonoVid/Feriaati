import { Dispatch, SetStateAction } from "react";
import { userType } from "./functionsTypes";

export type SessionUserData = {
    type?: userType;
    setType?: Dispatch<SetStateAction<userType>>;
    authUser?: string | undefined;
    setAuthUser?: Dispatch<SetStateAction<string>>;
    authToken?: string | undefined;
    setAuthToken?: Dispatch<SetStateAction<string>>;
};
