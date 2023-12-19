import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";
import { checkRegisterFields } from "../../check/checkRegisterFields";
import { messagesCode } from "../../constants/errors";
import {
    RegisterConfirm,
    RegisterFields,
} from "../../model/fields/registerFields";
import { ResponseData } from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";

export const registerAccountUser = (
    data: {
        formatedData: RegisterFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: string) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkRegisterFields(formatedData);

    console.log("ERROR CHECK::", check);

    if (check) {
        //Lock register button
        setCanSubmit(false);
        //Call firebase function to create user
        const addUser = httpsCallable<RegisterFields, ResponseData<string>>(
            functions,
            "addUser"
        );
        addUser(formatedData)
            .then((result) => {
                const { msg, error } = result.data;
                console.log(result);
                //Show alert message
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess(formatedData.email);
                }
            })
            .catch((error) => {
                console.log(error);
                setCanSubmit(true);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .finally(() => setCanSubmit(true));
    }
};

export const confirmRegisterUser = (
    data: {
        formatedData: RegisterConfirm;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: () => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    if (
        formatedData.code != null &&
        formatedData.code !== "" &&
        formatedData.email != null &&
        formatedData.email !== ""
    ) {
        setCanSubmit(false);
        const confirmRegister = httpsCallable<
            RegisterConfirm,
            ResponseData<string>
        >(functions, "confirmRegister");
        confirmRegister(formatedData)
            .then((result) => {
                const { msg, error } = result.data;
                console.log(result);
                //Show alert message
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .catch((error) => {
                console.log(error);
                setCanSubmit(true);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .finally(() => setCanSubmit(true));
    }
};
