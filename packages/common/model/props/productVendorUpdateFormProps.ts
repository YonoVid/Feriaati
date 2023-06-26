import { FormProps } from "./sharedProps";
import { FieldValues } from "react-hook-form";
import { ProductListCollectionData } from "../functionsTypes";
import { UpdateProductVendorFields } from "../fields/updateFields";

export type ProductVendorUpdateProps = FormProps & {
    editedVendor?: ProductListCollectionData;
    onSubmit: (data: UpdateProductVendorFields) => void;
    onCancel: () => void;
};

export type RProductVendorUpdateProps = ProductVendorUpdateProps & {
    buttonLabel: string;
    imageData: string;
    onSubmit: (data: FieldValues) => void;
    setImageData: React.Dispatch<React.SetStateAction<string>>;
};
