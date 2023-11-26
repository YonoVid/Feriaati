import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { checkProductVendorUpdate } from "../check/checkProductVendorUpdate";
import { UpdateProductVendorFields } from "../model/fields/updateFields";
import { ResponseData } from "../model/functionsTypes";

export type UpdateVendorData = {
    data: UpdateProductVendorFields;
};

export const updateVendor = (
    data: {
        formatedData: UpdateProductVendorFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit } = data;

    const check = checkProductVendorUpdate(formatedData);
    console.log("SUBMIT FORM ON EDIT VENDOR::", check);
    if (check) {
        setCanSubmit(false);
        console.log("DATA FORM ON EDIT VENDOR::", formatedData);
        // setCanSubmit(false);
        const editProduct = httpsCallable<
            UpdateProductVendorFields,
            ResponseData<string>
        >(functions, "productVendorUpdate");
        editProduct(formatedData)
            .then((result) => {
                console.log(result.data);

                onSuccess(result.data as ResponseData<string>);
            })
            .finally(() => setCanSubmit(true));
    }
};
