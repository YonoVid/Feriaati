import { FieldValues } from "react-hook-form";
import { LoginFields } from "./loginFields";

type LoginProps = {
    canSubmit?: boolean;
}
export type LoginFormProps = LoginProps & {
    onSubmit: (data: LoginFields) => void;
};

export type RLoginFormProps = LoginProps & {
    onSubmit: (data: FieldValues) => void;
};
