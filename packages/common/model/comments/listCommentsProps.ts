import { FormProps } from "@feria-a-ti/common/model/sharedProps";
import { UserComment } from "@feria-a-ti/common/model/functionsTypes";
import { FieldValues } from "react-hook-form";

export type ListCommentsProps = FormProps & {
    commentsVendor: string;
    isUser: boolean;
};

export type RListCommentsProps = ListCommentsProps & {
    onSubmit?: (data: FieldValues) => void;
};

export type CommentViewProps = FormProps & {
    comment?: UserComment;
    onReport: () => void;
};
