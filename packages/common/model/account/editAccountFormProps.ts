import { FieldValues } from "react-hook-form";
import { FormProps } from "@feria-a-ti/common/model/sharedProps";
import { EditVendorAccountFields } from "@feria-a-ti/common/model/account/editAccountFields";
import { AccountData } from "../functionsTypes";

export type RFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

export type EditAccountFormProps = RFormProps & {
    account?: AccountData;
    onSubmit: (data: EditVendorAccountFields) => void;
};

export type REditAccountFormProps = EditAccountFormProps & {
    onSubmit: (data: FieldValues) => void;
};
