import React, { useState } from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    UseControllerProps,
} from "react-hook-form";
import { View, Text, StyleSheet, TextInput, Keyboard } from "react-native";
import { RNInputComponentProps } from "../../common/model/inputProps";
import { colors } from "../../common/theme/base";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    type?: "text" | "password" | "email";
    error: FieldError | undefined;
}

const InputComponent = <T extends FieldValues>({
    name,
    label,
    type,
    control,
    rules,
    error,
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
            <Controller
                control={control}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <TextInput
                        autoCapitalize="none"
                        secureTextEntry={type == "password" ? true : false}
                        style={styles.input}
                        placeholder={labelText}
                        placeholderTextColor={
                            isFocused
                                ? styles.input.backgroundColor
                                : styles.input.borderColor
                        }
                        selectionColor={styles.input.color}
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
                        value={value}
                    />
                )}
                name={name}
            />
            {(isFocused || inputText !== "") && (
                <View style={styles.labelWrapper}>
                    <Text style={styles.label}>{labelText}</Text>
                </View>
            )}
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
