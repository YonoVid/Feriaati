import React, { useState } from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    UseControllerProps,
} from "react-hook-form";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import { colors } from "@feria-a-ti/common/theme/base";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    multiline?: boolean;
    style?: any;
    rows?: number;
    type?: "text" | "password" | "email" | "number";
    hidden?: boolean;
    error?: FieldError | undefined;
    onChange?: (value: string) => void;
}

const InputComponent = <T extends FieldValues>({
    name,
    label,
    style,
    multiline,
    rows,
    type,
    control,
    rules,
    error,
    onChange,
}: Props<T>) => {
    //const { name, label, control, rules, error } = props;
    const [isFocused, setFocusState] = useState(false);
    const [inputText, setInputText] = useState("");
    const labelText = label != null ? label : name;
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeWrapper = (
        onChange: (...event: any[]) => void,
        text: string
    ) => {
        console.log("ERROR", error?.type);
        switch (error?.type) {
            case "required": {
                setErrorMessage("Message required");
                break;
            }
            case "minLength": {
                setErrorMessage("Message minLength");
                break;
            }
        }
        setInputText(text);
        onChange(text);
        return text;
    };

    return (
        <>
            {control ? (
                <Controller
                    control={control}
                    rules={rules}
                    render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                    }) => (
                        <>
                            <TextInput
                                style={style}
                                autoCapitalize="none"
                                secureTextEntry={
                                    type == "password" ? true : false
                                }
                                multiline={multiline ? multiline : undefined}
                                numberOfLines={multiline ? rows : undefined}
                                //style={styles.input}
                                placeholder={labelText}
                                label={labelText}
                                // placeholderTextColor={
                                //     isFocused
                                //         ? styles.input.backgroundColor
                                //         : styles.input.borderColor
                                // }
                                selectionColor={styles.input.color}
                                mode="flat"
                                onFocus={() => {
                                    setFocusState(true);
                                }}
                                onEndEditing={() => {
                                    setFocusState(false);
                                }}
                                onBlur={onBlur}
                                onChangeText={(text) => {
                                    onChangeWrapper(onChange, text);
                                    console.log(error);
                                }}
                                onSubmitEditing={() => {
                                    Keyboard.dismiss();
                                }}
                                value={"" || value}
                                error={error != null}
                            />
                            <HelperText
                                type="error"
                                visible={error && error != null}
                            >
                                {(error && error.message) || ""}
                            </HelperText>
                        </>
                    )}
                    name={name}
                />
            ) : (
                <TextInput
                    style={style}
                    autoCapitalize="none"
                    secureTextEntry={type == "password" ? true : false}
                    multiline={multiline ? multiline : undefined}
                    numberOfLines={multiline ? rows : undefined}
                    placeholder={labelText}
                    label={labelText}
                    selectionColor={styles.input.color}
                    mode="flat"
                    onFocus={() => {
                        setFocusState(true);
                    }}
                    onEndEditing={() => {
                        setFocusState(false);
                    }}
                    onChangeText={onChange}
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                    error={error != null}
                />
            )}
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
