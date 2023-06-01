import { ChangeEvent } from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { MenuItem, TextField } from "@mui/material";
import "./InputComponent.css";
// import { Box, TextField } from "@mui/material";
// import { Controller } from "react-hook-form";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    type?: "text" | "password" | "email" | "file" | "select";
    selectOptions?: (string | number)[][];
    hidden?: boolean;
    onChange?: React.ChangeEventHandler;
}

const InputComponentAlt = <T extends FieldValues>({
    name,
    label,
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
            <Controller
                control={control}
                rules={rules}
                render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                }) => (
                    <TextField
                        sx={{ flex: 1, minWidth: "10em", maxWidth: "20em" }}
                        InputLabelProps={{
                            shrink: type === "file" ? true : undefined,
                        }}
                        select={type === "select"}
                        label={inputLabel}
                        margin="dense"
                        type={type}
                        color="secondary"
                        error={error != null}
                        variant="filled"
                        value={value || ""}
                        placeholder={inputLabel}
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
        </>
    );
};

export default InputComponentAlt;
