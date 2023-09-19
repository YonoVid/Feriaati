import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { ProductData } from "@feria-a-ti/common/model/functionsTypes";
import { ProductFields } from "./productAddFormProps";
import { ShoppingCartItem } from "./shoppingCartProps";

export type ProductListProps = FormProps & {
    vendorId: string;
    label: string;
    products: Array<ProductData>;
    isEditable: boolean;
    filter?: string;
    onSubmit?: (data: ProductFields) => void;
    addProduct?: (data: ShoppingCartItem, quantity: number) => void;
    onAdd?: () => void;
    onEdit?: (data: ProductData) => void;
    onReload?: () => void;
    onDelete?: (id: string) => void;
};

export type RProductListProps = ProductListProps & {
    onSubmit?: (data: FieldValues) => void;
};
