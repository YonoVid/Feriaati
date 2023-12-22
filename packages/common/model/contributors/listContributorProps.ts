import { FormProps } from "@feria-a-ti/common/model/props/sharedProps";
import { ContributorData } from "../functionsTypes";

export type ListContributorProps = FormProps & {
    contributors: ContributorData[];
    isAdding: boolean;
    onAdd: () => void;
    onEdit: (data: ContributorData) => void;
    onDelete: (id: string) => void;
};
