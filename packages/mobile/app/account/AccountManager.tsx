import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { EditAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";
import { AccountData } from "@feria-a-ti/common/model/functionsTypes";

import {
    editAccountUser,
    getAccountUser,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import EditAccountForm from "@feria-a-ti/mobile/components/forms/EditAccountForm";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface AccountManagerProps {
    navigation: NavigationProp<ParamListBase>;
}

export const AccountManager = () => {
    // Context variables
    const { authToken, emailUser, type, setMessage } = useAppContext();

    const [accountData, setAccountData] = useState<AccountData | "loading">();

    const [canSubmit, setCanSubmit] = useState(true);

    const getAccount = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            email: emailUser,
            type: type,
        };

        getAccountUser({ formatedData, setCanSubmit, setMessage }, (data) => {
            setAccountData(data);
        });
    };

    const onEdit = (data: EditAccountFields) => {
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

        editAccountUser({ formatedData, setCanSubmit, setMessage }, (data) => {
            setAccountData(data);
        });
    };

    useEffect(() => {
        if (!accountData || accountData == null) {
            setAccountData("loading");
            getAccount();
        }
    }, []);

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                <EditAccountForm
                    account={
                        accountData && accountData !== "loading"
                            ? accountData
                            : undefined
                    }
                    onSubmit={onEdit}
                    canSubmit={canSubmit}
                />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
