import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { ProductData } from "./functionsTypes";
import { ProductFields } from "./productAddFormProps";

export type ProductListProps = FormProps & {
    label: string;
    products: Array<ProductData>;
    onSubmit: (data: ProductFields) => void;
};

export type RProductListProps = ProductListProps & {
    onSubmit: (data: FieldValues) => void;
};
