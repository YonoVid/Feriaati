import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";

enum dataKey {
    authUser = "authUser",
    authToken = "authToken",
    type = "type",
}

export const getSessionEmail = async () => {
    try {
        return await SecureStore.getItemAsync(dataKey.authUser);
    } catch (e) {
        // saving error
        console.log(e);
        throw new e();
    }
};

export const getSessionToken = async () => {
    try {
        return await SecureStore.getItemAsync(dataKey.authToken);
    } catch (e) {
        // saving error
        console.log(e);
        throw new e();
    }
};

export const getSessionType = async () => {
    try {
        return (await SecureStore.getItemAsync(dataKey.type)) as userType;
    } catch (e) {
        // saving error
        console.log(e);
        throw new e();
    }
};

export const setSession = async (data: UserToken) => {
    try {
        await SecureStore.setItemAsync(dataKey.authUser, data.email);
        await SecureStore.setItemAsync(dataKey.authToken, data.token);
        await SecureStore.setItemAsync(dataKey.type, data.type);
    } catch (e) {
        // saving error
        console.log(e);
        throw new e();
    }
};

export const resetSession = async () => {
    await SecureStore.deleteItemAsync(dataKey.authUser);
    await SecureStore.deleteItemAsync(dataKey.authToken);
    await SecureStore.deleteItemAsync(dataKey.type);
};

export const checkSession = async (): Promise<boolean> => {
    try {
        const authUser = await getSessionEmail();
        const authToken = await getSessionToken();
        const type = await getSessionType();
        if (
            authUser == null &&
            authUser == "" &&
            authToken == null &&
            authToken != "" &&
            type != null &&
            type != userType.undefined
        ) {
            resetSession();
            return false;
        }
        return true;
    } catch (e) {
        // saving error
        console.log(e);
    }
};
