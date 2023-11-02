import { FieldValues } from "react-hook-form";
import { FormProps } from "./sharedProps";

import {
    ConfirmRegisterFields,
    RegisterFields,
    RegisterVendorFields,
} from "@feria-a-ti/common/model/fields/registerFields";
import { CommentCollectionData, UserComment } from "../functionsTypes";

export type CommentFormProps = FormProps & {
    comment?: UserComment;
    onSubmit: (data: FieldValues) => void;
};

export type RFormProps = FormProps & {
    comment?: CommentCollectionData;
    onSubmit: (data: FieldValues) => void;
};

export type RegisterFormProps = FormProps & {
    onSubmit: (data: RegisterFields) => void;
};

export type RegisterVendorFormProps = FormProps & {
    onSubmit: (data: RegisterVendorFields) => void;
};

export type ConfirmRegisterFormProps = FormProps & {
    onSubmit: (data: ConfirmRegisterFields) => void;
};

export type RRegisterFormProps = RFormProps & {
    type?: "register";
};

export type RRegisterVendorFormProps = RRegisterFormProps & {
    setImageData: React.Dispatch<React.SetStateAction<string | ArrayBuffer>>;
    setCanSubmit?: React.Dispatch<React.SetStateAction<boolean>>;
};
