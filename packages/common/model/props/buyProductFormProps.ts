import { FormProps } from "react-router-dom";
import {
    AccountData,
    ProductCollectionData,
    ProductFactureData,
} from "@feria-a-ti/common/model/functionsTypes";
import { FieldValues } from "react-hook-form";
import { EditFormAccountFields } from "../account/editAccountFields";
import { BuyProductFormFields } from "../fields/buyingFields";

export type BuyProductFormProps = {
    canSubmit: boolean;
    // factureData: { [id: string]: ProductFactureData[] };
    // finalPrice: number;
    account?: AccountData;
    onSubmit: (data: BuyProductFormFields) => void;
};

export type RBuyProductFormProps = BuyProductFormProps & {
    onSubmit: (data: FieldValues) => void;
};
