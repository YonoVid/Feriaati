import { FieldValues } from "react-hook-form";
import { FormProps } from "react-router-dom";
import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

export type FacturesListProps = FormProps & {
    userId: string;
    label: string;
    factures: Array<FactureData>;
    filter?: string;
    loadSize?: number;
    onReload?: () => void;
};

export type RFacturesListProps = FacturesListProps & {
    loadData?: (index: number) => void;
};
