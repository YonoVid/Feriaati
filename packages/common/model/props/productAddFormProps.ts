import { FormProps } from "./sharedProps";
import { FieldValues } from "react-hook-form";
import { ProductData, ProductDiscount, ProductUnit } from "../functionsTypes";
import { UserRequestFields } from "../fields/fields";

export enum unitType {
    KILOGRAM = "kilogram",
    GRAM = "gram",
    unit = "unit",
}

export type ProductFields = {
    tokenVendor?: string;
    name: string;
    description: string;
    unitType: ProductUnit;
    unit?: number;
    price: number;
    discount: ProductDiscount;
    promotion?: number;
    image: [string, string, string] | string;
};
export type ProductEditFields = ProductFields & {
    id: string;
};

export type ProductListFields = UserRequestFields & {
    idProducts?: string;
};

export type ProductDeleteFields = ProductListFields & {
    idProducts: string;
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
    setCanSubmit?: React.Dispatch<React.SetStateAction<boolean>>;
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
