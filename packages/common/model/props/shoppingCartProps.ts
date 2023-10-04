import { FormProps } from "react-router-dom";
import {
    ProductCollectionData,
    ProductFactureData,
} from "@feria-a-ti/common/model/functionsTypes";

export type ShoppingCartItem = {
    id: { productId: string; vendorId: string };
    value: ProductCollectionData;
    quantity: number;
};

export type ShoppingCartProps = FormProps & {
    label: string;
    products: ShoppingCartItem[];
    isEditable: boolean;
    canSubmit: boolean;
    onEdit?: (index: number, quantity: number) => void;
    onDelete?: (index: number) => void;
    onSubmit: () => void;
};
