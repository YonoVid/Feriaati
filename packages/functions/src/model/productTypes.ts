//
// VENDOR PRODUCTS RELATED TYPES
//

export type ProductListCollectionData = {
    vendorId: string;
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion: number;
    image: [string, string, string];
};
