import { FormProps } from "react-router-dom";
import {
    AccountData,
    ProductCollectionData,
    ProductFactureData,
} from "@feria-a-ti/common/model/functionsTypes";
import { FieldValues } from "react-hook-form";
import { EditFormAccountFields } from "../account/editAccountFields";

export type BuyProductFormProps = {
    canSubmit: boolean;
    // factureData: { [id: string]: ProductFactureData[] };
    // finalPrice: number;
    account?: AccountData;
    onSubmit: (data: EditFormAccountFields) => void;
};

export type RBuyProductFormProps = BuyProductFormProps & {
    onSubmit: (data: FieldValues) => void;
};
