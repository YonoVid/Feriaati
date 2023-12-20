import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import { checkLoginFields } from "../check/checkLoginFields";
import { LoginFields } from "../model/fields/loginFields";
import { ResponseData, UserToken } from "../model/functionsTypes";
import { MessageData } from "../model/sessionType";

export const loginBuyer = (
    data: {
        formatedData: LoginFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: UserToken) => void
) => {
    const { formatedData } = data;

    const check = checkLoginFields(formatedData);
    if (check) {
        loginCall(data, onSuccess, "login");
    }
};

export const loginVendor = (
    data: {
        formatedData: LoginFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: UserToken) => void
) => {
    const { formatedData } = data;

    const check = checkLoginFields(formatedData);
    if (check) {
        loginCall(data, onSuccess, "loginVendor");
    }
};

export const loginAdmin = (
    data: {
        formatedData: LoginFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: UserToken) => void
) => {
    const { formatedData } = data;

    const check = checkLoginFields(formatedData);
    if (check) {
        loginCall(data, onSuccess, "adminLogin");
    }
};

const loginCall = (
    data: {
        formatedData: LoginFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: UserToken) => void,
    functionName: string = "login"
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkLoginFields(formatedData);

    if (check) {
        setCanSubmit(false);

        const login = httpsCallable(functions, functionName);
        login(formatedData)
            .then((result) => {
                const {
                    msg,
                    error,
                    extra: { email, type, token, id },
                } = result.data as ResponseData<UserToken>;
                console.log(result);
                console.log(formatedData.attempts);
                setCanSubmit(true);
                //setIsLogged(result.data as any);

                if (msg !== "") {
                    setMessage({ msg, isError: error });
                }
                if (token != null && token !== "") {
                    onSuccess({ email, type, token, id });
                }
            })
            .catch(() => {
                setMessage({
                    msg: "Error de conexión con el servidor",
                    isError: true,
                });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
