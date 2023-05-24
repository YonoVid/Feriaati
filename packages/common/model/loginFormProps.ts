import { FieldValues } from "react-hook-form";
import { LoginFields, RecoveryFields, UpdatePassFields } from "./loginFields";
import { FormProps } from "./sharedProps";

export type LoginFormProps = FormProps & {
    onSubmit: (data: LoginFields) => void;
};

export type RLoginFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

type RecoveryProps = {
    canSubmit?: boolean;
};
export type RecoveryFormProps = RecoveryProps & {
    onSubmit: (data: RecoveryFields) => void;
};
export type RRecoveryFormProps = RecoveryProps & {
    onSubmit: (data: FieldValues) => void;
};

type UpdatePassProps = {
    canSubmit?: boolean;
};
export type UpdatepPassFormProps = UpdatePassProps & {
    onSubmit: (data: UpdatePassFields) => void;
};
export type RUpdatepPassFormProps = UpdatePassProps & {
    onSubmit: (data: FieldValues) => void;
};
