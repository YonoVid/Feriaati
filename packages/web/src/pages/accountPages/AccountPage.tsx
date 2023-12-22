import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

import { AccountData } from "@feria-a-ti/common/model/functionsTypes";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { EditAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";

import {
    editAccountUser,
    getAccountUser,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import EditAccountForm from "@feria-a-ti/web/src/components/forms/editAccountForm/EditAccountForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";
import "@feria-a-ti/web/src/App.css";

function AccountPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    const [accountData, setAccountData] = useState<AccountData | "loading">();

    const [canSubmit, setCanSubmit] = useState(true);

    const getAccountData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            email: emailUser as string,
            token: authToken as string,
            type: type,
        };

        getAccountUser(
            { formatedData, setCanSubmit, setMessage },
            (value: AccountData) => {
                setAccountData(value);
            }
        );
    };

    const onEditAccount = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: EditAccountFields = {
            email: emailUser as string,
            token: authToken,
            type: type,
            updateEmail: data.email,
            password: data.password,
            direction: data.direction,
            phone: data.phone,
        };

        editAccountUser(
            { formatedData, setCanSubmit, setMessage },
            (value: AccountData) => {
                setAccountData(value);
            }
        );
    };

    useEffect(() => {
        if (!accountData || accountData == null) {
            setAccountData("loading");
            getAccountData();
        }
    }, []);

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
