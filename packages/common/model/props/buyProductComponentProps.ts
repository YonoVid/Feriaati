import {
    ProductFactureData,
    ProductListCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";

export type BuyProductComponentProps = {
    canSubmit: boolean;
    factureData: { [id: string]: ProductFactureData[] };
    vendorData: {
        [id: string]: ProductListCollectionData;
    };
    finalPrice: number;
    onSubmit: () => void;
    children?: any;
};
