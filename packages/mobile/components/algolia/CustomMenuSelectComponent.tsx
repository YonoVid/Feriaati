import React, { useEffect } from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { useClearRefinements } from "react-instantsearch";

import Dropdown from "react-native-paper-dropdown";

import {
    communeCodeDictionary,
    regionCodeDictionary,
} from "@feria-a-ti/common/constants/form";
import { CustomMenuSelectProps } from "@feria-a-ti/common/model/props/customSearchProps";
import { colors } from "@feria-a-ti/common/theme/base";
import { Portal, Provider } from "react-native-paper";

const CustomMenuSelectComponent = (
    props: CustomMenuSelectProps & { type: "region" | "commune" }
) => {
    const { items, refine, type } = props;

    const { refine: clearRefine } = useClearRefinements({
        includedAttributes: [type],
    });

    const [valueDropdown, setValueDropdown] = useState<string>("default");
    const [showDropdown, setShowDropdown] = useState(false);

    const label = "Selección de " + (type === "region" ? "región" : "comuna");
    const replaceDictionary =
        type === "region" ? regionCodeDictionary : communeCodeDictionary;

    const updateRefine = (newValue: string) => {
        setValueDropdown(newValue);

        if (newValue === "default") {
            clearRefine();
        } else {
            refine(newValue);
        }
    };

    useEffect(() => {
        console.log(items);

        setValueDropdown("default");

        items.forEach((item) => {
            if (item.isRefined) {
                setValueDropdown(item.value);
            }
        });
    }, [items]);

    return (
        <View
            style={{
                ...styles.container,
                paddingBottom: 8,
            }}
        >
            <Dropdown
                placeholder={label}
                label={label}
                visible={showDropdown}
                showDropDown={() => {
                    setShowDropdown(true);
                    console.log("OPEN FILTER MENU");
                }}
                onDismiss={() => setShowDropdown(false)}
                mode="flat"
                setValue={(value) => {
                    updateRefine(value);
                    setValueDropdown(value);
                }}
                list={items
                    .concat([
                        {
                            label: "Todos",
                            value: "default",
                            count: 0,
                            isRefined: false,
                        },
                    ])
                    .map((item) => {
                        const data = {
                            label:
                                replaceDictionary[item.label as string] ||
                                item.label,
                            value: item.value,
                        };
                        return data;
                    })}
                value={valueDropdown || ""}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    labelWrapper: {
        alignItems: "center",
        marginTop: "-2%",
        flexDirection: "row",
    },
    label: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        alignSelf: "flex-start",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 15,
        paddingHorizontal: "5%",
        borderRadius: 10,
    },
    input: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        marginTop: "2%",
        height: 40,
        marginHorizontal: 0,
        borderRadius: 50,
    },
    container: {
        padding: 18,
        backgroundColor: "#ffffff",
    },
});

export default CustomMenuSelectComponent;
