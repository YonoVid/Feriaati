//
// VENDOR PRODUCTS RELATED TYPES
//

export type ProductListCollectionData = {
    vendorId: string;
    products: Array<ProductCollectionData>;
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    isPercentage: boolean;
    promotion: number;
    image: [string, string, string];
};
