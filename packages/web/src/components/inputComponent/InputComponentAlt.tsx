import { ChangeEvent, useState } from "react";
import { RInputComponentProps } from "@feria-a-ti/common/model/inputProps";
import "./InputComponent.css";
import { Controller } from "react-hook-form";
import { MenuItem, TextField } from "@mui/material";
// import { Box, TextField } from "@mui/material";
// import { Controller } from "react-hook-form";

function InputComponentAlt(data: RInputComponentProps) {
    const { name, label, type, selectOptions, rules, control, onChange } = data;

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
                        select={type === "select"}
                        label={inputLabel}
                        margin="dense"
                        type={type}
                        color="secondary"
                        error={error != null}
                        variant="filled"
                        value={value || ""}
                        placeholder={inputLabel}
                        onChange={(value) => {
                            onChangeWrapper(onChange, value);
                        }}
                        onBlur={onBlur}
                        helperText={error?.message}
                    >
                        {type === "select" &&
                            selectOptions?.map((value) => (
                                <MenuItem key={value[0]} value={value[0]}>
                                    {value[1]}
                                </MenuItem>
                            ))}
                    </TextField>
                )}
                name={name as string}
            ></Controller>
        </>
    );
}

export default InputComponentAlt;
