import { Dispatch, SetStateAction } from "react";

export type SessionUserData = {
    type: "admin" | "buyer" | "vendor" | undefined;
    setType?: Dispatch<
        SetStateAction<"admin" | "buyer" | "vendor" | undefined>
    >;
    auth?: string | undefined;
    setAuth?: Dispatch<SetStateAction<string>>;
};
