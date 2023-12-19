import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { checkProductVendorUpdate } from "../../check/checkProductVendorUpdate";
import { UpdateProductVendorFields } from "../../model/fields/updateFields";
import { ResponseData, VendorData } from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";
import { messagesCode } from "../../constants/errors";
import {
    DeleteFields,
    UpdateFullVendorFields,
    UpdateStateFields,
} from "../../model/fields/adminFields";
import { checkVendorFullUpdate } from "../../../functions/lib/vendor/checkVendor";
import { checkAccountFullUpdate } from "../../check/checkAccountUpdate";

export type UpdateVendorData = {
    data: UpdateProductVendorFields;
};

export const getNewVendorList = (
    data: {
        formatedData: string;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: VendorData[]) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;
    setCanSubmit(false);

    const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
        functions,
        "registerVendorList"
    );
    vendors(formatedData)
        .then((response) => {
            onSuccess(response.data.extra as VendorData[]);
        })
        .catch((error) => {
            console.log(error);
            setMessage({ msg: messagesCode["ERR00"], isError: error });
            setCanSubmit(true);
        })
        .finally(() => setCanSubmit(true));
};

export const editVendorState = (
    data: {
        formatedData: UpdateStateFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: () => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const updateState = httpsCallable<UpdateStateFields, ResponseData<null>>(
        functions,
        "vendorStateUpdate"
    );
    console.log("SELECTED USER::", id);
    updateState(formatedData)
        .then((response) => {
            const { msg, error } = response.data;
            console.log(response.data);
            setMessage({ msg, isError: error });
            if (!error) {
                onSuccess();
            }
        })
        .catch((error) => {
            console.log(error);
            setMessage({ msg: messagesCode["ERR00"], isError: error });
            setCanSubmit(true);
        })
        .finally(() => setCanSubmit(true));
};

export const getVendorList = (
    data: {
        formatedData: string;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: VendorData[]) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = formatedData && formatedData !== "";

    if (check) {
        const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
            functions,
            "vendorList"
        );
        vendors(formatedData)
            .then((response) => {
                const { error, extra } = response.data;

                console.log("USERS DATA::", extra);
                if (!error) {
                    onSuccess(extra);
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
export const editVendor = (
    data: {
        formatedData: UpdateFullVendorFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: () => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;
    setCanSubmit(false);

    const check = checkAccountFullUpdate(formatedData);
    console.log("PRODUCT VENDOR FULL UPDATE CHECK::", check);
    if (check) {
        setCanSubmit(false);
        const updateState = httpsCallable<
            UpdateFullVendorFields,
            ResponseData<null>
        >(functions, "updateVendor");

        updateState(formatedData)
            .then((response) => {
                const { msg, error } = response.data;
                console.log(response.data);
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const deleteVendor = (
    data: {
        formatedData: DeleteFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: () => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = formatedData.itemId !== null && formatedData.itemId !== "";

    console.log("SUBMIT FORM ON EDIT VENDOR::", check);
    if (check) {
        setCanSubmit(false);

        const updateState = httpsCallable<DeleteFields, ResponseData<null>>(
            functions,
            "deleteselectedVendor"
        );

        updateState(formatedData)
            .then((response) => {
                const { msg, error } = response.data;
                console.log(response.data);
                setMessage({ msg, isError: error });
                if (!error) {
                    onSuccess();
                }
            })
            .catch((error) => {
                console.log(error);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
