import { FormProps } from "@feria-a-ti/common/model/sharedProps";
import { FieldValues } from "react-hook-form";
import { ProductListCollectionData } from "./functionsTypes";

export type ProductVendorUpdateProps = FormProps & {
    editedVendor?: ProductListCollectionData;
    onSubmit: (data: ProductListCollectionData) => void;
    onCancel: () => void;
};

export type RProductVendorUpdateProps = ProductVendorUpdateProps & {
    buttonLabel: string;
    imageData: string;
    onSubmit: (data: FieldValues) => void;
};
