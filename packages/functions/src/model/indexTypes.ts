import { ProductCollectionData, ProductListCollection } from "./productTypes";

export type ProductIndex = ProductCollectionData & {
    objectID: string;
};

export type ProductVendorIndex = ProductListCollection & {
    objectID: string;
    active: boolean;
};
