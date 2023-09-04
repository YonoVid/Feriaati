import { ProductData, ProductListCollectionData } from "../functionsTypes";
import { ShoppingCartItem } from "./shoppingCartProps";

export type ProductVendorPageProps = {
    vendorData: Partial<ProductListCollectionData>;
    isEditable: boolean;
    products: ProductData[];
    onReload?: () => void;
    addProduct?: (data: ShoppingCartItem) => void;
    onAdd?: () => void;
    onUpdatePage?: () => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};
