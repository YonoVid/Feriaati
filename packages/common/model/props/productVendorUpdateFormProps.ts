import { FormProps } from "./sharedProps";
import { FieldValues } from "react-hook-form";
import { ProductListCollectionData, ProductListData } from "../functionsTypes";
import { UpdateProductVendorFields } from "../fields/updateFields";
import { UpdateFullProductVendorFields } from "../fields/adminFields";

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

export type ProductVendorFullUpdateProps = FormProps & {
    productList?: ProductListData;
    imageData: string;
    onSubmit: (data: UpdateFullProductVendorFields) => void;
    onCancel: () => void;
};

export type RProductVendorFullUpdateProps = ProductVendorFullUpdateProps & {
    onSubmit: (data: FieldValues) => void;
    setImageData: React.Dispatch<React.SetStateAction<string>>;
};
