import { FieldValues } from "react-hook-form";
import {
    LoginFields,
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";
import { FormProps } from "./sharedProps";

export type LoginFormProps = FormProps & {
    label?: string;
    onSubmit: (data: LoginFields) => void;
};

export type RLoginFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

export type RecoveryFormProps = FormProps & {
    onSubmit: (data: RecoveryFields) => void;
};
export type RRecoveryFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

export type UpdatepPassFormProps = FormProps & {
    onSubmit: (data: UpdatePassFields) => void;
};
export type RUpdatepPassFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};
