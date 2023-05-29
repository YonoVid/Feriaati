import { FieldValues } from "react-hook-form";
import { FormProps } from "@feria-a-ti/common/model/sharedProps";

import {
    ConfirmRegisterFields,
    RegisterFields,
    RegisterVendorFields,
} from "@feria-a-ti/common/model/registerFields";

export type RFormProps = FormProps & {
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
};
