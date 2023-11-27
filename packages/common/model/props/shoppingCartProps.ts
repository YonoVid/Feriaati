import { FormProps } from "react-router-dom";
import { ProductCollectionData } from "@feria-a-ti/common/model/functionsTypes";

export type ProductId = {
    vendorId: string;
    productId: string;
};

export type ShoppingCartItem = {
    id: ProductId;
    value: ProductCollectionData;
    quantity: number;
};

export type ShoppingCartProps = FormProps & {
    label: string;
    products: ShoppingCartItem[];
    isEditable: boolean;
    canSubmit: boolean;
    onEdit?: (id: ProductId, quantity: number) => void;
    onDelete?: (id: ProductId) => void;
    onSubmit: () => void;
};
