import {
    ProductCollectionData,
    ProductData,
    ProductListCollectionData,
} from "../functionsTypes";

export type ProductVendorPageProps = {
    vendorData: Partial<ProductListCollectionData>;
    isEditable: boolean;
    products: ProductData[];
    onReload?: () => void;
    addProduct?: (data: ProductCollectionData, quantity: number) => void;
    onAdd?: () => void;
    onUpdatePage?: () => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};
