import { ProductFactureData } from "./productTypes";

export type UserFactureCollectionData = {
    products: { [id: string]: ProductFactureData[] };
    buyer: string;
    date: Date;
};
