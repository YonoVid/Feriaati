import { ChangeEvent } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import {
    InputBaseComponentProps,
    MenuItem,
    SxProps,
    TextField,
    Theme,
} from "@mui/material";
import "./InputComponent.css";

interface Props<T extends FieldValues> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
    value?: unknown;
    inputProps?: InputBaseComponentProps | undefined;
    label: string;
    disabled?: boolean;
    multiline?: boolean;
    rows?: number;
    type?: "text" | "number" | "password" | "email" | "file" | "select";
    selectOptions?: (string | number)[][];
    hidden?: boolean;
    onChange?: React.ChangeEventHandler;
}

const InputComponentAlt = <T extends FieldValues>({
    sx,
    inputProps,
    name,
    label,
    disabled,
    multiline,
    rows,
    defaultValue,
    selectOptions,
    type,
    control,
    rules,
    value,
    onChange,
}: Props<T>) => {
    const inputLabel = label != null ? label : name;

    const onChangeWrapper = (
        onChangeWrapped: (...event: any[]) => void,
        value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        if (onChange != null) {
            onChange(value);
        }
        onChangeWrapped(value);
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
                        <TextField
                            sx={{
                                flex: 1,
                                minWidth: "10em",
                                maxWidth: "20em",
                                ...sx,
                            }}
                            multiline={multiline ? true : false}
                            rows={multiline ? rows : undefined}
                            disabled={disabled || false}
                            InputLabelProps={{
                                shrink: type === "file" ? true : undefined,
                            }}
                            inputProps={
                                type === "number"
                                    ? {
                                          inputMode: "numeric",
                                          pattern: "[0-9]*",
                                          ...inputProps,
                                      }
                                    : { ...inputProps }
                            }
                            select={type === "select"}
                            label={inputLabel}
                            margin="dense"
                            type={type === "number" ? "text" : type}
                            color="secondary"
                            error={error != null}
                            variant="filled"
                            value={value || ""}
                            placeholder={defaultValue || inputLabel}
                            defaultValue={defaultValue}
                            onSubmit={() => onChange(value.trim())}
                            onChange={(value) => {
                                onChangeWrapper(onChange, value);
                            }}
                            onLostPointerCapture={() =>
                                console.log("ON LOST ENDED")
                            }
                            onEnded={() => console.log("ON ENDED")}
                            onBlur={onBlur}
                            helperText={error?.message || ""}
                        >
                            {type === "select" && selectOptions ? (
                                selectOptions?.map((value) => (
                                    <MenuItem key={value[0]} value={value[0]}>
                                        {value[1]}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem>{defaultValue}</MenuItem>
                            )}
                        </TextField>
                    )}
                    name={name}
                ></Controller>
            ) : (
                <TextField
                    sx={{ flex: 1, minWidth: "10em", maxWidth: "20em", ...sx }}
                    disabled={disabled || false}
                    InputLabelProps={{
                        shrink: type === "file" ? true : undefined,
                    }}
                    inputProps={
                        type === "number"
                            ? { inputMode: "numeric", pattern: "[0-9]*" }
                            : {}
                    }
                    select={type === "select"}
                    label={inputLabel}
                    margin="dense"
                    type={type === "number" ? "text" : type}
                    color="secondary"
                    variant="filled"
                    placeholder={inputLabel}
                    defaultValue={defaultValue}
                    onChange={(value) => {
                        onChange && onChange(value);
                    }}
                    value={value}
                >
                    {type === "select" && selectOptions ? (
                        selectOptions?.map((value) => (
                            <MenuItem key={value[0]} value={value[0]}>
                                {value[1]}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem>{defaultValue}</MenuItem>
                    )}
                </TextField>
            )}
        </>
    );
};

export default InputComponentAlt;
