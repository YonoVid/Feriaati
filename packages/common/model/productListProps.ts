import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { ProductData } from "./functionsTypes";
import { ProductFields } from "./productAddFormProps";

export type ProductListProps = FormProps & {
    label: string;
    products: Array<ProductData>;
    isEditable: boolean;
    filter?: string;
    onSubmit?: (data: ProductFields) => void;
    onEdit?: (data: ProductData) => void;
    onReload?: () => void;
    onDelete?: (id: string) => void;
};

export type RProductListProps = ProductListProps & {
    onSubmit?: (data: FieldValues) => void;
};
