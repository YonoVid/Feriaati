import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { ProductData } from "./functionsTypes";
import { ProductFields } from "./productAddFormProps";

export type ProductListProps = FormProps & {
    label: string;
    products: Array<ProductData>;
    isEditable: boolean;
    onSubmit?: (data: ProductFields) => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};

export type RProductListProps = ProductListProps & {
    onSubmit?: (data: FieldValues) => void;
};
