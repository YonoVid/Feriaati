import React, { useState } from "react";
import { Appbar, Drawer, Menu } from "react-native-paper";
import { httpsCallable } from "@firebase/functions";

import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { functions } from "@feria-a-ti/common/firebase";
import { LogoutFields } from "@feria-a-ti/common/model/fields/loginFields";
import {
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";

import { useAppContext } from "../app/AppContext";

export default function AppBar(props: NativeStackHeaderProps) {
    //Session context data
    // Context variables
    const { authUser, authToken, type, resetSession } = useAppContext();

    const { navigation, route, options, back } = props;
    const [visible, setVisible] = useState(false);
    const [active, setActive] = useState("");

    const logout = () => {
        resetSession && resetSession();
        try {
            console.log("LOGOUT::", authUser, ":", type);
            const logout = httpsCallable<LogoutFields, ResponseData<null>>(
                functions,
                "logoutUser"
            );
            logout({
                token: authToken as string,
                type: type,
            }).then((result) => {
                // const { msg, error } = result.data;
                console.log(result.data);
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const openMenu = () => {
        console.log(visible);
        setVisible(true);
    };
    const closeMenu = () => {
        console.log(visible);
        setVisible(false);
    };

    const title = getHeaderTitle(options, route.name);

    return (
        <>
            <Appbar.Header>
                {back ? (
                    <Appbar.BackAction onPress={navigation.goBack} />
                ) : null}
                <Appbar.Content title={title} />
                {!back ? (
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <Appbar.Action
                                icon="dots-vertical"
                                onPress={openMenu}
                            />
                        }
                    >
                        {type === userType.undefined ||
                        authToken === null ||
                        authToken === "" ? (
                            <Menu.Item
                                onPress={() => {
                                    closeMenu();
                                }}
                                title={"About"}
                            />
                        ) : (
                            <>
                                <Menu.Item
                                    onPress={() => {
                                        navigation.replace("session");
                                        closeMenu();
                                    }}
                                    title={"HOME"}
                                />
                                {(type === userType.user ||
                                    type === userType.vendor) && (
                                    <Menu.Item
                                        onPress={() => {
                                            navigation.replace(
                                                "accountManager"
                                            );
                                            closeMenu();
                                        }}
                                        title={"Account"}
                                    />
                                )}
                                <Menu.Item
                                    onPress={() => {
                                        console.log(
                                            "LAST SCREEN NAME::",
                                            route.name
                                        );
                                        navigation.navigate("subscription");
                                        closeMenu();
                                    }}
                                    title={"Subscripción"}
                                />
                                <Menu.Item
                                    onPress={() => {
                                        console.log(
                                            "LAST SCREEN NAME::",
                                            route.name
                                        );
                                        logout();
                                        navigation.replace("session");
                                        console.log("TOKEN::", authToken);
                                        console.log("TYPE::", type);
                                        closeMenu();
                                    }}
                                    title={"Logout"}
                                />
                            </>
                        )}
                    </Menu>
                ) : null}
            </Appbar.Header>
        </>
    );
}
