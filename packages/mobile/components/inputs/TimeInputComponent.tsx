import React, { useState } from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    UseControllerProps,
} from "react-hook-form";
import { View, Text, StyleSheet, Keyboard } from "react-native";
import { Button, HelperText, IconButton, TextInput } from "react-native-paper";
import { DatePickerInput, TimePickerModal } from "react-native-paper-dates";
import { colors } from "@feria-a-ti/common/theme/base";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    multiline?: boolean;
    style?: any;
    rows?: number;
    type?: "text" | "password" | "email" | "number";
    hidden?: boolean;
    error?: FieldError | undefined;
}

const TimeInputComponent = <T extends FieldValues>({
    name,
    label,
    defaultValue,
    control,
    rules,
    error,
}: Props<T>) => {
    //const { name, label, control, rules, error } = props;
    const labelText = label != null ? label : name;

    const [visible, setVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onChangeWrapper = (
        onChange: (...event: any[]) => void,
        value: any
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
        onChange(value);
        return value;
    };

    const onDismiss = React.useCallback(() => {
        setVisible(false);
    }, [setVisible]);

    const onConfirm = React.useCallback(
        ({ hours, minutes }) => {
            setVisible(false);
            console.log({ hours, minutes });
        },
        [setVisible]
    );

    return (
        <>
            <Controller
                control={control}
                defaultValue={defaultValue}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <>
                        <IconButton
                            style={{
                                minWidth: "100%",
                                maxHeight: "100%",
                                backgroundColor: colors.primary,
                            }}
                            onPress={() => setVisible(true)}
                            icon={() => (
                                <Text
                                    style={{
                                        color: colors.light,
                                        width: "100%",
                                        textAlign: "center",
                                    }}
                                    numberOfLines={2}
                                >
                                    {labelText +
                                        ":\n" +
                                        (value && value != null
                                            ? value.hours
                                                  .toString()
                                                  .padStart(2, "0") +
                                              ":" +
                                              value.minutes
                                                  .toString()
                                                  .padStart(2, "0")
                                            : "XX:XX")}
                                </Text>
                            )}
                        />
                        <TimePickerModal
                            visible={visible}
                            locale="cl"
                            label={labelText}
                            use24HourClock
                            onConfirm={(data) => {
                                onConfirm(data);
                                const newValue: DayTime = {
                                    hours: data.hours,
                                    minutes: data.minutes,
                                };
                                onChange(newValue);
                            }}
                            onDismiss={onDismiss}
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

export default TimeInputComponent;
