//
// VENDOR PRODUCTS RELATED TYPES
//

export type ProductListCollectionData = {
    vendorId: string;
    enterpriseName: string;
    rut: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    image: string;
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion: number;
    image: [string, string, string];
};
