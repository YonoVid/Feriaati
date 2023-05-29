import { FieldValues } from "react-hook-form";
import {
    LoginFields,
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import { FormProps } from "@feria-a-ti/common/model/sharedProps";

export type LoginFormProps = FormProps & {
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
