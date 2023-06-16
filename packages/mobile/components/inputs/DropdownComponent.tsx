import React, { useState } from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    UseControllerProps,
} from "react-hook-form";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { TextInput } from "react-native-paper";
import Dropdown from "react-native-paper-dropdown";

import { colors } from "@feria-a-ti/common/theme/base";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    list: (string | number)[][];
    defaultValue?: any;
    error?: FieldError | undefined;
}

const InputComponent = <T extends FieldValues>({
    name,
    label,
    defaultValue,
    list,
    control,
    rules,
    error,
}: Props<T>) => {
    //const { name, label, control, rules, error } = props;
    const [valueDropdown, setValueDropdown] = useState(defaultValue || null);
    const [showDropdown, setShowDropdown] = useState(false);
    const labelText = label != null ? label : name;

    const onChangeWrapper = (
        onChange: (...event: any[]) => void,
        value: any
    ) => {
        console.log("ERROR", error?.type);
        onChange(value);
        setValueDropdown(value);
        return value;
    };

    return (
        <>
            <Controller
                control={control}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <Dropdown
                        //style={styles.input}
                        placeholder={labelText}
                        label={labelText}
                        visible={showDropdown}
                        showDropDown={() => setShowDropdown(true)}
                        onDismiss={() => setShowDropdown(false)}
                        mode="flat"
                        setValue={(value) => {
                            onChange(value);
                            setValueDropdown(value);
                        }}
                        list={list.map((element) => {
                            const data = {
                                label: element[1] as string,
                                value: element[0],
                            };
                            return data;
                        })}
                        value={"" || valueDropdown}
                    />
                )}
                name={name}
            />
            {/* {(isFocused || inputText !== "") && (
                <View style={styles.labelWrapper}>
                    <Text style={styles.label}>{labelText}</Text>
                </View>
            )} */}
            {error && <Text>{error?.message || "ERROR"}</Text>}
        </>
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
});

export default InputComponent;
