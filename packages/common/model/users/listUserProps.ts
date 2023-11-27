import { FormProps } from "@feria-a-ti/common/model/props/sharedProps";
import { UserData } from "../functionsTypes";

export type ListUserProps = FormProps & {
    users: UserData[];
    onEdit: (data: UserData) => void;
    onDelete: (id: string) => void;
};
