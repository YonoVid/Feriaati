import React from "react";
import { Appbar, Menu } from "react-native-paper";
import { getHeaderTitle } from "@react-navigation/elements";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export default function AppBar(props: NativeStackHeaderProps) {
    const { navigation, route, options, back } = props;
    const [visible, setVisible] = React.useState(false);
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
        <Appbar.Header>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
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
                    <Menu.Item
                        onPress={() => {
                            console.log("LAST SCREEN NAME::", route.name);
                            navigation.replace(
                                route.name == "loginClient"
                                    ? "loginVendor"
                                    : "loginClient"
                            );
                            closeMenu();
                        }}
                        title={
                            route.name == "loginClient"
                                ? "Ir a acceso de vendedor"
                                : "Ir a acceso de comprador"
                        }
                    />
                </Menu>
            ) : null}
        </Appbar.Header>
    );
}
