import { FormProps } from "react-router-dom";
import {
    ProductCollectionData,
    ProductFactureData,
} from "@feria-a-ti/common/model/functionsTypes";

export type BuyProductComponentProps = {
    canSubmit: boolean;
    factureData: { [id: string]: ProductFactureData[] };
    finalPrice: number;
    onSubmit: () => void;
};
