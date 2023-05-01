import { FieldValues } from "react-hook-form";
import { RegisterFields } from "./registerFields";

export type RegisterFormProps = {
    onSubmit: (data: RegisterFields) => void;
};

export type RRegisterFormProps = {
    onSubmit: (data: FieldValues) => void;
};
