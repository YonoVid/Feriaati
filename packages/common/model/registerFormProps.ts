import { FieldValues } from "react-hook-form";
import { RegisterFields } from "./registerFields";
//import { LoginFields } from "./loginFields";

type RegisterProps = {
    canSubmit?: boolean;
}


export type RegisterFormProps = RegisterProps & {
    onSubmit: (data: RegisterFields) => void;
};

export type RRegisterFormProps = RegisterProps & {
    onSubmit: (data: FieldValues) => void;
};

