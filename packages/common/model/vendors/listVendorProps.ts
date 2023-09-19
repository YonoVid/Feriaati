import { FormProps } from "@feria-a-ti/common/model/props/sharedProps";
import { ProductListData, VendorData } from "../functionsTypes";

export type ListVendorProps = FormProps & {
    vendors: VendorData[];
    onEdit: (data: VendorData) => void;
    onDelete: (id: string) => void;
};

export type ListProductVendorProps = FormProps & {
    productVendors: ProductListData[];
    onEdit: (data: ProductListData) => void;
    onDelete: (id: string) => void;
};
