import { ProductData, ProductListCollectionData } from "../functionsTypes";

export type ProductVendorPageProps = {
    vendorData: Partial<ProductListCollectionData>;
    isEditable: boolean;
    products: ProductData[];
    onReload?: () => void;
    onAdd?: () => void;
    onUpdatePage?: () => void;
    onEdit?: (data: ProductData) => void;
    onDelete?: (id: string) => void;
};
