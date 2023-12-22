import {
    AccountDirection,
    FactureStatus,
    ProductFactureData,
    userType,
} from "../functionsTypes";
import { UserRequestFields } from "./fields";

export type ProductFactureFields = {
    token: string;
    direction?: AccountDirection;
    products: { [id: string]: ProductFactureData[] };
};

export type ProductSubscriptionFields = {
    token: string;
    priceTotal: number;
    type: userType;
};

export enum FactureTypes {
    PRODUCTS = "products",
    SUBSCRIPTION = "subscription",
}

export type UpdateFactureFields = {
    token: string;
    userType: userType;
    facture: string;
    status: FactureStatus;
    type: FactureTypes;
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
