import {
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
    UseFormRegister,
} from "react-hook-form";

export type InputComponentProps = {
    name: string;
    type?: string;
    style?: object;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    onChange?: React.ChangeEventHandler;
    hookForm: UseFormRegister<FieldValues>;
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
};

export function controlValidInput(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(typeof e);
    // console.log(e);
    var value = e.currentTarget.value;

    if (value != null) {
        e.currentTarget.value = value.trim();

        console.log(value);

        const check = new RegExp("^[^<>'\\\"/;`% ]*$");

        if (!check.test(value)) {
            //if it is not a number ascii code
            //Prevent default action, which is inserting character
            if (e.preventDefault) e.preventDefault(); //normal browsers
            //e..currentTarget.value = ""; //IE
        }
    }
}

export function controlValidStringInput(
    e: React.ChangeEvent<HTMLInputElement>
) {
    //console.log(typeof e);
    //console.log(e);
    var value = e.currentTarget.value;

    if (value != null) {
        console.log(value);

        const check = new RegExp("^[^<>'\\\"/;`%]*$");

        if (!check.test(value)) {
            //if it is not a number ascii code
            //Prevent default action, which is inserting character
            if (e.preventDefault) e.preventDefault(); //normal browsers
            //e..currentTarget.value = ""; //IE

            return null;
        }
    }
    return value;
}
