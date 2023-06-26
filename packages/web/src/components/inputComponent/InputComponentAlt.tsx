import { ChangeEvent } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { MenuItem, SxProps, TextField, Theme } from "@mui/material";
import "./InputComponent.css";
// import { Box, TextField } from "@mui/material";
// import { Controller } from "react-hook-form";

interface Props<T> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
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
                                      }
                                    : {}
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
                            onChange={(value) => {
                                onChangeWrapper(onChange, value);
                            }}
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
                    sx={{ flex: 1, minWidth: "10em", maxWidth: "20em" }}
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
