import { ProductData, ProductListCollectionData } from "./functionsTypes";

export type ProductVendorPageProps = {
    vendorData: Partial<ProductListCollectionData>;
    isEditable: boolean;
    products: ProductData[];
    onAdd?: () => void;
    onUpdatePage?: () => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};
