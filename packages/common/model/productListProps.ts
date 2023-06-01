import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { ProductFields } from "./productAddFormProps";

export type ProductListProps = FormProps & {
    label: string;
    onSubmit: (data: ProductFields) => void;
};

export type RProductListProps = ProductListProps & {
    onSubmit: (data: FieldValues) => void;
};
