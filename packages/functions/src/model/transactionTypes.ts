import { AccountDirection } from "./accountTypes";
import { FactureStatus, ProductFactureData } from "./productTypes";
import { TimeDate } from "./sharedTypes";

export type UserFactureCollectionData = {
    products: { [id: string]: ProductFactureData[] };
    direction?: AccountDirection;
    status: FactureStatus;
    buyer: string;
    date: Date;
};

export type UserFactureCollectionStoredData = {
    products: { [id: string]: ProductFactureData[] };
    status: FactureStatus;
    buyer: string;
    date: TimeDate;
};
