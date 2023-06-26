import { FormProps } from "./sharedProps";
import { FieldValues } from "react-hook-form";
import { ProductData } from "../functionsTypes";

export type ProductFields = {
    tokenVendor?: string;
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion?: number;
    image: [string, string, string] | string;
};
export type ProductEditFields = ProductFields & {
    id: string;
};

export type ProductListFields = {
    tokenVendor?: string;
    idVendor?: string;
};

export type ProductDeleteFields = ProductListFields & {
    productId: string;
};

export type ProductAddFormProps = FormProps & {
    editedProduct?: ProductData;
    setEditedProduct?: (value: ProductData | null) => void;
    onSubmit: (data: ProductFields) => void;
};

export type RProductAddFormProps = ProductAddFormProps & {
    buttonLabel: string;
    imageData: [string, string, string];
    editableState?: ProductData | null;
    setImageData: (data: [string, string, string]) => void;
    onSubmit: (data: FieldValues) => void;
    onCancel?: () => void;
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
