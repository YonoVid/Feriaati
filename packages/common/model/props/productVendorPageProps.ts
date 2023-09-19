import { ProductData, ProductListCollectionData } from "../functionsTypes";
import { ShoppingCartItem } from "./shoppingCartProps";

export type ProductVendorPageProps = {
    vendorId: string;
    vendorData: Partial<ProductListCollectionData>;
    isEditable: boolean;
    products: ProductData[];
    onReload?: () => void;
    addProduct?: (data: ShoppingCartItem, quantity: number) => void;
    onAdd?: () => void;
    onUpdatePage?: () => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};
