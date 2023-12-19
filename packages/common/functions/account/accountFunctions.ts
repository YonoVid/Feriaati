import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import { GetAccountFields } from "../../model/account/getAccountFields";
import { AccountData, ResponseData } from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";

import { messagesCode } from "../../constants/errors";

import {
    checkEditAccountFields,
    checkGetAccountFields,
} from "../../check/checkAccountFields";
import { EditAccountFields } from "../../model/account/editAccountFields";
import { UpdatePassFields } from "../../model/fields/updateFields";
import {
    checkRecoveryFields,
    checkUpdatePassFields,
} from "../../check/checkLoginFields";
import { RecoveryFields } from "../../model/fields/loginFields";

export const getAccountUser = (
    data: {
        formatedData: GetAccountFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: AccountData) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    console.log("SUBMIT FORM");
    const check = checkGetAccountFields(formatedData);

    console.log("ERROR CHECK::", check);

    if (check) {
        //Lock register button
        setCanSubmit(false);
        //Call firebase function to create user
        const getAccount = httpsCallable<
            GetAccountFields,
            ResponseData<AccountData>
        >(functions, "getAccountUser");
        getAccount(formatedData)
            .then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result);
                //Show alert message
                setMessage({ msg, isError: error });
                onSuccess(extra);
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true)); //Unlock register button
    }
};

export const editAccountUser = (
    data: {
        formatedData: EditAccountFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: AccountData) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkEditAccountFields(formatedData);

    console.log("ERROR CHECK::", check);

    if (check) {
        //Lock register button
        setCanSubmit(false);
        //Call firebase function to create user
        const getAccount = httpsCallable<
            EditAccountFields,
            ResponseData<AccountData>
        >(functions, "editAccountUser");
        getAccount(formatedData)
            .then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result);
                //Show alert message
                setMessage({ msg, isError: error });
                !error && extra && onSuccess(extra);
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true)); //Unlock register button
    }
};

export const recoverPasswordUser = (
    data: {
        formatedData: RecoveryFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: string) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkRecoveryFields(formatedData);
    console.log(formatedData);
    if (check) {
        setCanSubmit(false);
        const passRecovery = httpsCallable<
            RecoveryFields,
            ResponseData<string>
        >(functions, "passRecovery");
        passRecovery(formatedData)
            .then((result) => {
                const { error, msg } = result.data;
                console.log(result);
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess(formatedData.email);
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const editPasswordUser = (
    data: {
        formatedData: UpdatePassFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: () => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkUpdatePassFields(formatedData);
    console.log("SUBMIT FORM::", formatedData);
    if (check) {
        setCanSubmit(false);
        const passUpdate = httpsCallable<
            UpdatePassFields,
            ResponseData<string>
        >(functions, "passUpdate");
        passUpdate(formatedData)
            .then((result) => {
                const { error, msg } = result.data;
                console.log(result);
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
