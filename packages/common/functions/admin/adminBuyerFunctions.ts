import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { checkProductVendorFullUpdate } from "../../check/checkProductVendorUpdate";
import {
    ProductListData,
    ResponseData,
    UserData,
} from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";
import { messagesCode } from "../../constants/errors";
import {
    DeleteFields,
    UpdateFullProductVendorFields,
    UpdateFullUserFields,
} from "../../model/fields/adminFields";
import { checkAccountFullUpdate } from "../../check/checkAccountUpdate";

export const getBuyerList = (
    data: {
        formatedData: string;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (value: UserData[]) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = formatedData && formatedData !== "";

    if (check) {
        const vendors = httpsCallable<string, ResponseData<UserData[]>>(
            functions,
            "userList"
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
export const editBuyer = (
    data: {
        formatedData: UpdateFullUserFields;
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
            UpdateFullUserFields,
            ResponseData<null>
        >(functions, "updateselectedUser");

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

export const deleteBuyer = (
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
            "deleteUser"
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
