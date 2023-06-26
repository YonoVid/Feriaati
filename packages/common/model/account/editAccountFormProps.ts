import { FieldValues } from "react-hook-form";
import { FormProps } from "../props/sharedProps";
import { EditFormAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";
import { AccountData } from "@feria-a-ti/common/model/functionsTypes";

export type RFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

export type EditAccountFormProps = RFormProps & {
    account?: AccountData;
    onSubmit: (data: EditFormAccountFields) => void;
};

export type REditAccountFormProps = EditAccountFormProps & {
    onSubmit: (data: FieldValues) => void;
};
