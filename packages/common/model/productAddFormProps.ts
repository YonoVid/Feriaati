import { FormProps } from "@feria-a-ti/common/model/sharedProps";
import { FieldValues } from "react-hook-form";

export type ProductFields = {
    tokenVendor: string;
    name: string;
    description: string;
    price: number;
    isPercentage: boolean;
    promotion: number;
    image: [string, string, string];
};

export type ProductAddFormProps = FormProps & {
    onSubmit: (data: ProductFields) => void;
};

export type RProductAddFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};

export type UpdateProductFields = ProductFields & {
    productId: string;
};
export type ProductUpdateFormProps = FormProps & {
    onSubmit: (data: UpdateProductFields) => void;
};

export type RProductUpdateFormProps = FormProps & {
    onSubmit: (data: FieldValues) => void;
};
