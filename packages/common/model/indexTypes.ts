export enum IndexType {
    PRODUCT = 0,
    PRODUCTVENDOR = 1,
}

export type SearchIndex = {
    objectID: string;
    id: string;
    name: string;
    description: string;
    image: string;
    type: IndexType;
    active: boolean;
};

export type ProductIndex = SearchIndex & {
    price: string;
    vendorId: string;
};

export type ProductVendorIndex = SearchIndex & {
    rate: number;
};
