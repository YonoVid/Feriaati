import { FieldValues } from "react-hook-form";

import { ConfirmRegisterFields, RegisterFields } from "./registerFields";

type FormProps = {
    canSubmit?: boolean;
};

export type RFormProps = {
    canSubmit?: boolean;
    onSubmit: (data: FieldValues) => void;
};

export type RegisterFormProps = FormProps & {
    onSubmit: (data: RegisterFields) => void;
};

export type ConfirmRegisterFormProps = FormProps & {
    onSubmit: (data: ConfirmRegisterFields) => void;
};

export type RRegisterFormProps = RFormProps & {
    type?: "register";
};
