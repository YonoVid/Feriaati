// import { ChangeEvent } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

import { SxProps, Theme } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import { DayTime } from "@feria-a-ti/common/model/baseTypes";

import "./TimeInputComponent.css";
import { useEffect, useState } from "react";

interface Props<T> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
    label: string;
    type?: "time" | "date";
    hidden?: boolean;
    onChange?: (value: DayTime) => void;
}

const today = dayjs();
const pastTwelve = today.set("hour", 23).set("minutes", 59);

export const TimeInputComponent = <T extends FieldValues>({
    sx,
    name,
    label,
    defaultValue,
    control,
    rules,
    onChange,
}: Props<T>) => {
    const inputLabel = label != null ? label : name;

    const [dayjsValue, setDayjsValue] = useState<Dayjs>(today);

    const onChangeWrapper = (
        onChangeWrapped: (...event: any[]) => void,
        value: any | null
    ) => {
        const dayjsValue = value as Dayjs;
        console.log("INPUT VALUE::", value, dayjsValue.isValid());
        const timeValue: DayTime = {
            hours: dayjsValue.toDate().getHours(),
            minutes: dayjsValue.toDate().getMinutes(),
        };

        if (onChange != null) {
            onChange(timeValue);
        }
        onChangeWrapped(timeValue);
        setDayjsValue(dayjsValue);
        console.log("TIME VALUE::", timeValue);
    };

    useEffect(() => {
        if (defaultValue) {
            const newDayjsValue = dayjsValue
                .set("hour", defaultValue.hours)
                .set("minutes", defaultValue.minutes);

            setDayjsValue(newDayjsValue);
        }
    }, [defaultValue]);

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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                sx={{
                                    flex: 1,
                                    minWidth: "10em",
                                    maxWidth: "20em",
                                    ...sx,
                                }}
                                slotProps={{
                                    textField: {
                                        helperText: error?.message || "",
                                        error: error != null,
                                        margin: "dense",
                                        color: "secondary",
                                        variant: "filled",
                                        value: dayjsValue || "",
                                        placeholder:
                                            dayjsValue.format("HH:mm") || label,
                                        onBlur: onBlur,
                                    },
                                }}
                                ampm={false}
                                label={inputLabel}
                                views={["hours", "minutes"]}
                                value={dayjsValue || ""}
                                onChange={(value: any) =>
                                    onChangeWrapper(onChange, value)
                                }
                            />
                        </LocalizationProvider>
                    )}
                    name={name}
                ></Controller>
            ) : (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        sx={{
                            flex: 1,
                            minWidth: "10em",
                            maxWidth: "20em",
                            ...sx,
                        }}
                        slotProps={{
                            textField: {
                                margin: "dense",
                                color: "secondary",
                                variant: "filled",
                                placeholder: defaultValue || label,
                            },
                        }}
                        label={inputLabel}
                        views={["hours", "minutes"]}
                        defaultValue={defaultValue || today.toString()}
                        onChange={(value) => {
                            onChange &&
                                onChangeWrapper(() => {
                                    console.log(value);
                                }, value);
                        }}
                    />
                </LocalizationProvider>
            )}
        </>
    );
};

export default TimeInputComponent;
