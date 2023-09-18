import { ProductFactureData } from "./productTypes";

export type UserFactureCollectionData = {
    products: { [id: string]: ProductFactureData[] };
    buyer: string;
    date: Date;
};

export type UserFactureCollectionStoredData = {
    products: { [id: string]: ProductFactureData[] };
    buyer: string;
    date: TimeDate;
};

export type TimeDate = {
    seconds: number;
    nanoseconds: number;
};
