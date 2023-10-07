import { AccountDirection, ProductFactureData } from "../functionsTypes";
import { UserRequestFields } from "./fields";

export type ProductFactureFields = {
    token: string;
    products: { [id: string]: ProductFactureData[] };
};

export enum BuyTransportOptions {
    RETIRE = "retiro",
    DELIVERY = "envio",
}

export type BuyProductFormFields = UserRequestFields & {
    products: { [id: string]: ProductFactureData[] };
    shipping: BuyTransportOptions;
    direction?: AccountDirection;
};
