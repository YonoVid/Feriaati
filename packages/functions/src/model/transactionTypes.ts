import { Timestamp } from "firebase-admin/firestore";
import { AccountDirection } from "./accountTypes";
import { FactureStatus, ProductFactureData } from "./productTypes";
import { TimeDate } from "./sharedTypes";

export type VendorProductData = {
    docId: string;
    id: string;
    products: ProductFactureData[];
    time: Timestamp;
};

export type FactureResumeCollection = {
    products: {
        [id: string]: { name: string; quantity: number; subtotal: number };
    };
    transactions: number;
    totalIncome: number;
};

export type YearFactureResumeCollection = {
    day: { [id: number]: FactureResumeCollection };
    month: { [id: number]: FactureResumeCollection };
    year: number;
    transactions: number;
    totalIncome: number;
    lastUpdate: Date;
};

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
    factureId?: string;
};
