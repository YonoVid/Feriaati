//
// VENDOR PRODUCTS RELATED TYPES
//

import { LogicalData } from "./sharedTypes";
import { TimeDate } from "./transactionTypes";

export type DayTime = {
    hours: number;
    minutes: number;
    seconds?: number;
};

export type DayTimeRange = { start: DayTime; end: DayTime };

export type ProductListCollection = {
    rating?: { positive: number; negative: number };
    enterpriseName: string;
    rut: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    image: string;
    serviceTime?: DayTimeRange;
    contact?: { phone: string; email: string };
    vendorId: string;
};

export type ProductListCollectionData = LogicalData & ProductListCollection;

export enum ProductUnit {
    UNIT = "none",
    GRAM = "gram",
    KILOGRAM = "kilogram",
}

export enum ProductDiscount {
    NONE = "none",
    PERCENTAGE = "percentage",
    VALUE = "value",
}

export type ProductCollectionData = {
    name: string;
    description: string;
    unitType: ProductUnit;
    unit?: number;
    price: number;
    discount: ProductDiscount;
    promotion?: number;
    image: [string, string, string] | string;
};

export type ProductFactureData = {
    id: string;
    name: string;
    quantity: number;
    subtotal: number;
};

export type FactureData = {
    id: string;
    date: TimeDate;
    products: Array<ProductFactureData>;
};
