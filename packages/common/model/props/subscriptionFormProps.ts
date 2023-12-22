import { SubscriptionData } from "@feria-a-ti/common/model/functionsTypes";
import { FieldValues } from "react-hook-form";
import { SubscriptionFormFields } from "../account/subscriptionAccountFields";

export type SubscriptionFormProps = {
    canSubmit: boolean;
    subscription?: SubscriptionData;
    onSubmit: (data: SubscriptionFormFields) => void;
};

export type RSubscriptionFormProps = SubscriptionFormProps & {
    onSubmit: (data: FieldValues) => void;
};
