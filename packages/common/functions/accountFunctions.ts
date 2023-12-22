import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import { GetAccountFields } from "../model/account/getAccountFields";
import { AccountData, ResponseData } from "../model/functionsTypes";
import { MessageData } from "../model/sessionType";

import { messagesCode } from "../constants/errors";

import { checkGetAccountFields } from "../check/checkAccountFields";

export const getAccountData = (
    user: GetAccountFields,
    setAccountData: (AccountData) => void,
    setCanSubmit: (value: boolean) => void,
    setMessage: (value: MessageData) => void
) => {
    console.log("SUBMIT FORM");
    const check = checkGetAccountFields(user);

    console.log("ERROR CHECK::", check);

    if (check) {
        //Lock register button
        setCanSubmit(false);
        //Call firebase function to create user
        const getAccount = httpsCallable<
            GetAccountFields,
            ResponseData<AccountData>
        >(functions, "getAccountUser");
        getAccount(user)
            .then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result);
                //Show alert message
                setMessage({ msg, isError: error });
                setAccountData(extra);
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .finally(() => setCanSubmit(true)); //Unlock register button
    }
};
