//
// VENDOR PRODUCTS RELATED TYPES
//

import { LogicalData } from "./sharedTypes";

export type DayTime = {
    hours: number;
    minutes: number;
    seconds?: number;
};

export type DayTimeRange = { start: DayTime; end: DayTime };

export type ProductListCollectionData = LogicalData & {
    vendorId: string;
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
};

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
    unit?: ProductUnit;
    price: number;
    discount: ProductDiscount;
    promotion: number;
    image: [string, string, string];
};
