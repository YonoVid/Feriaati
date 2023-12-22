import { FieldValues } from "react-hook-form";
import { FormProps } from "./sharedProps";

import { RegisterContributorFields } from "@feria-a-ti/common/model/fields/registerFields";
import { ContributorData } from "../functionsTypes";

export type RegisterContributorFormProps = FormProps & {
    contributor?: ContributorData;
    isEdit: boolean;
    onSubmit: (data: RegisterContributorFields) => void;
    onCancel: () => void;
};

export type RRegisterContributorFormProps = RegisterContributorFormProps & {
    onSubmit: (data: FieldValues) => void;
};
