import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { UpdateContributorFields } from "../model/fields/updateFields";
import { ContributorData, ResponseData } from "../model/functionsTypes";
import { RegisterContributorFields } from "../model/fields/registerFields";
import {
    checkContributorAdd,
    checkContributorEdit,
} from "../check/checkContributorFIelds";
import { DeleteFields } from "../model/fields/adminFields";

export const deleteContributor = (
    data: {
        formatedData: DeleteFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit } = data;

    console.log(
        "SUBMIT FORM ON EDIT VENDOR::",
        formatedData.token != null &&
            formatedData.token != undefined &&
            formatedData.itemId != null &&
            formatedData.itemId != undefined
    );
    if (
        formatedData.token != null &&
        formatedData.token != undefined &&
        formatedData.itemId != null &&
        formatedData.itemId != undefined
    ) {
        setCanSubmit(false);
        console.log("DATA FORM ON EDIT VENDOR::", formatedData);
        // setCanSubmit(false);
        const deleteProduct = httpsCallable<DeleteFields, ResponseData<string>>(
            functions,
            "deleteContributor"
        );
        deleteProduct(formatedData)
            .then((result) => {
                console.log(result.data);

                onSuccess(result.data as ResponseData<string>);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const updateContributor = (
    data: {
        formatedData: UpdateContributorFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<ContributorData>) => void
) => {
    const { formatedData, setCanSubmit } = data;

    const check = checkContributorEdit(formatedData);
    console.log("SUBMIT FORM ON EDIT VENDOR::", check);
    if (check) {
        setCanSubmit(false);
        console.log("DATA FORM ON EDIT VENDOR::", formatedData);
        // setCanSubmit(false);
        const editProduct = httpsCallable<
            UpdateContributorFields,
            ResponseData<ContributorData>
        >(functions, "updateContributor");
        editProduct(formatedData)
            .then((result) => {
                console.log(result.data);

                onSuccess(result.data as ResponseData<ContributorData>);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const addContributor = (
    data: {
        formatedData: RegisterContributorFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<ContributorData>) => void
) => {
    const { formatedData, setCanSubmit } = data;

    const check = checkContributorAdd(formatedData);
    console.log("SUBMIT FORM ON EDIT VENDOR::", check);
    if (check) {
        setCanSubmit(false);
        console.log("DATA FORM ON EDIT VENDOR::", formatedData);
        // setCanSubmit(false);
        const editProduct = httpsCallable<
            RegisterContributorFields,
            ResponseData<ContributorData>
        >(functions, "addContributor");
        editProduct(formatedData)
            .then((result) => {
                console.log(result.data);

                onSuccess(result.data as ResponseData<ContributorData>);
            })
            .finally(() => setCanSubmit(true));
    }
};
