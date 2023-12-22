import { AccountData } from "@feria-a-ti/common/model/functionsTypes";
import { FieldValues } from "react-hook-form";
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
