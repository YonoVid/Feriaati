import { Dispatch, SetStateAction } from "react";

export type SessionUserData = {
    auth?: string | undefined;
    setAuth: Dispatch<SetStateAction<string>>;
};
