import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import {
    AccountData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    checkEditAccountFields,
    checkGetAccountFields,
} from "@feria-a-ti/common/check/checkAccountFields";
import EditAccountForm from "@feria-a-ti/web/src/components/forms/editAccountForm/EditAccountForm";

import { useHeaderContext } from "../HeaderLayout";
import { UserContext } from "../../App";
import "@feria-a-ti/web/src/App.css";
import { EditAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";

function AccountPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    const [accountData, setAccountData] = useState<AccountData | "loading">();

    const [canSubmit, setCanSubmit] = useState(true);

    const getAccountData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            type: type,
        };
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
                    setAccountData(extra);
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    const onEditAccount = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: EditAccountFields = {
            token: authToken,
            type: type,
            email: data.email,
            password: data.password,
            direction: data.direction,
            phone: data.phone,
        };
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
                    !error && extra && setAccountData(extra);
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    useEffect(() => {
        if (!accountData || accountData == null) {
            setAccountData("loading");
            getAccountData();
        }
    });

    return (
        <>
            <EditAccountForm
                account={
                    accountData && accountData !== "loading"
                        ? accountData
                        : undefined
                }
                onSubmit={onEditAccount}
                canSubmit={canSubmit}
            ></EditAccountForm>
        </>
    );
}

export default AccountPage;
