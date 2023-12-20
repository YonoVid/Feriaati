import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import { UpdateContributorFields } from "../../model/fields/updateFields";
import { ContributorData, ResponseData } from "../../model/functionsTypes";
import { RegisterContributorFields } from "../../model/fields/registerFields";
import {
    checkContributorAdd,
    checkContributorEdit,
} from "../../check/checkContributorFIelds";
import { DeleteFields } from "../../model/fields/adminFields";
import { MessageData } from "../../model/sessionType";
import { UserRequestFields } from "../../model/fields/fields";

export const getContributorList = async (
    data: {
        formatedData: UserRequestFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ContributorData[]) => void
) => {
    try {
        const { formatedData, setCanSubmit, setMessage } = data;

        const users = httpsCallable<
            UserRequestFields,
            ResponseData<ContributorData[]>
        >(functions, "contributorList");
        users(formatedData)
            .then((result) => {
                const { msg, error: isError, extra } = result.data;
                console.log(result.data);

                if (!isError) {
                    onSuccess(extra as ContributorData[]);
                } else {
                    setMessage({ msg, isError });
                }
            })
            .catch(() => {
                setMessage({
                    msg: "Error de conexión con el servidor",
                    isError: true,
                });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    } catch (error) {
        console.error("Error al obtener los vendedores:", error);
    }
};

export const addContributor = (
    data: {
        formatedData: RegisterContributorFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ContributorData) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

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
                const { msg, error: isError, extra } = result.data;
                console.log(result.data);

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra as ContributorData);
                }
            })
            .catch(() => {
                setMessage({
                    msg: "Error de conexión con el servidor",
                    isError: true,
                });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const updateContributor = (
    data: {
        formatedData: UpdateContributorFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ContributorData) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

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
                const { msg, error: isError, extra } = result.data;
                console.log(result.data);

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra as ContributorData);
                }
            })
            .catch(() => {
                setMessage({
                    msg: "Error de conexión con el servidor",
                    isError: true,
                });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const deleteContributor = (
    data: {
        formatedData: DeleteFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: string) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

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
                const { msg, error: isError, extra } = result.data;
                console.log(result.data);

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra as string);
                }
            })
            .catch(() => {
                setMessage({
                    msg: "Error de conexión con el servidor",
                    isError: true,
                });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
