import React, { useEffect, useState } from "react";
import { httpsCallable, FunctionsError } from "firebase/functions";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { functions } from "@feria-a-ti/common/firebase";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";
import { EditAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";
import {
    checkEditAccountFields,
    checkGetAccountFields,
} from "@feria-a-ti/common/check/checkAccountFields";

import {
    AccountData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { useAppContext } from "../AppContext";
import EditAccountForm from "../../components/forms/EditAccountForm";
import { Button } from "react-native-paper";

export interface AccountManagerProps {
    navigation: NavigationProp<ParamListBase>;
}

export const AccountManager = () => {
    // Context variables
    const { authToken, type, setMessage } = useAppContext();

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

    const onEditAccount = (data: EditAccountFields) => {
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
        console.log("DATA CHECKED::", formatedData);

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
                    onSubmit={onEditAccount}
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
