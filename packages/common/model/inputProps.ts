import React from "react";
import {
    Control,
    FieldError,
    FieldErrorsImpl,
    FieldPath,
    FieldValues,
    Merge,
    RegisterOptions,
    UseFormRegister,
    UseFormSetError,
    UseFormWatch,
} from "react-hook-form";

type InputComponentProps = {
    name: string;
    label?: string;
    type?: "text" | "email" | "password" | "select" | "file";
    style?: object;
    watch?: UseFormWatch<FieldValues>;
    setError?: UseFormSetError<FieldValues>;
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
};

export type RInputComponentProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = InputComponentProps & {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    onChange?: React.ChangeEventHandler;
    registerForm?: UseFormRegister<FieldValues>;
    rules?: Omit<
        RegisterOptions<FieldValues, TName>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
    control?: Control<FieldValues, any>;
    selectOptions?: (string | number)[][];
    defaultValue?: string;
    test?: TName;
};

export type RNInputComponentProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = InputComponentProps & {
    rules?: Omit<
        RegisterOptions<FieldValues, TName>,
        "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
    control: Control<FieldValues, any>;
    onChange?: (text: string) => void;
};
