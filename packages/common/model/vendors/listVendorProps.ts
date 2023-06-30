import { FormProps } from "@feria-a-ti/common/model/props/sharedProps";
import { ProductListData } from "../functionsTypes";

export type ListVendorProps = FormProps & {
    vendors: ProductListData[];
    onEdit: (data: ProductListData) => void;
    onDelete: (id: string) => void;
};
