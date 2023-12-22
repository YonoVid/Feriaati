import { GetAccountFields } from "./getAccountFields";

export type SubscriptionFormFields = {
    amount: number;
    months: number;
    renovation: boolean;
};

export type SubscriptionFields = GetAccountFields & {
    amount: number;
    months: number;
};
