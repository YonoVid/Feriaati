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
} from "react-hook-form";

type InputComponentProps = {
    name: string;
    label?: string;
    type?: "text" | "email" | "password";
    style?: object;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    registerForm: UseFormRegister<FieldValues>;
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
};

export type RInputComponentProps = InputComponentProps & {
    onChange?: React.ChangeEventHandler;
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
