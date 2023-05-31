import { FormProps } from "@feria-a-ti/common/model/sharedProps";
import { FieldValues } from "react-hook-form";

export type ProductFields = {
    name: string;
    description: string;
    price: number;
    isPercentage: boolean;
    promotion: number;
    image: string[3];
};

export type ProductAddFormProps = FormProps & {
    onSubmit: (data: ProductFields) => void;
};

export type RProductAddFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};
