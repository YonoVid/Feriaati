import { ProductFactureData } from "../functionsTypes";

export type ProductFactureFields = {
    token: string;
    products: { [id: string]: ProductFactureData[] };
};
