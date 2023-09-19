import { FormProps } from "./sharedProps";
import { FieldValues } from "react-hook-form";
import {
    ProductListCollectionData,
    ProductListData,
    UserData,
    VendorData,
} from "../functionsTypes";
import { UpdateProductVendorFields } from "../fields/updateFields";
import {
    UpdateFullProductVendorFields,
    UpdateFullUserFields,
    UpdateFullVendorFields,
} from "../fields/adminFields";

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

export type VendorFullUpdateProps = FormProps & {
    vendor?: VendorData;
    onSubmit: (data: UpdateFullVendorFields) => void;
    onCancel: () => void;
};

export type RVendorFullUpdateProps = VendorFullUpdateProps & {
    onSubmit: (data: FieldValues) => void;
};

export type UserFullUpdateProps = FormProps & {
    user?: UserData;
    onSubmit: (data: UpdateFullUserFields) => void;
    onCancel: () => void;
};

export type RUserFullUpdateProps = UserFullUpdateProps & {
    onSubmit: (data: FieldValues) => void;
};
