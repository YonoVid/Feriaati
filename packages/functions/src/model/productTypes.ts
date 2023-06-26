//
// VENDOR PRODUCTS RELATED TYPES
//

export type DayTime = {
    hours: number;
    minutes: number;
    seconds?: number;
};

export type DayTimeRange = { start: DayTime; end: DayTime };

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
    serviceTime?: DayTimeRange;
    contact?: { phone: string; email: string };
};

export type ProductCollectionData = {
    name: string;
    description: string;
    price: number;
    discount: "none" | "percentage" | "value";
    promotion: number;
    image: [string, string, string];
};
