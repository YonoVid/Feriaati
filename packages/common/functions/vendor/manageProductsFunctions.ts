import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    checkAddProductFields,
    checkDeleteProductFields,
} from "../../check/checkProductFields";
import { checkProductVendorUpdate } from "../../check/checkProductVendorUpdate";
import { messagesCode } from "../../constants/errors";
import { UpdateProductVendorFields } from "../../model/fields/updateFields";
import {
    ProductData,
    ProductListData,
    ResponseData,
} from "../../model/functionsTypes";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductFields,
    ProductListFields,
} from "../../model/props/productAddFormProps";
import { MessageData } from "../../model/sessionType";

export const listProducts = (
    data: {
        formatedData: ProductListFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ProductData[]) => void
) => {
    const { formatedData, setMessage, setCanSubmit } = data;

    const check = formatedData.token != null && formatedData.token != "";
    console.log("SUBMIT FORM LOAD PRODUCTS::", check);
    if (check) {
        setCanSubmit(false);

        const listProduct = httpsCallable<
            ProductListFields,
            ResponseData<ProductData[]>
        >(functions, "listProduct");
        listProduct(formatedData)
            .then((result) => {
                const { msg, error: isError, extra } = result.data;

                onSuccess(extra);
                if (isError) {
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
    }
};

export const addProduct = (
    data: {
        formatedData: ProductFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkAddProductFields(formatedData);
    console.log(formatedData);
    console.log("SUBMIT FORM ON EDIT::", check);
    if (check) {
        setCanSubmit(false);

        const addProduct = httpsCallable<ProductFields, ResponseData<string>>(
            functions,
            "addProduct"
        );
        addProduct(formatedData)
            .then((result) => {
                const {
                    msg,
                    error: isError,
                    extra,
                } = result.data as ResponseData<string>;
                console.log(result.data);

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra);
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

export const editProduct = (
    data: {
        formatedData: ProductEditFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkAddProductFields(formatedData);
    console.log(formatedData);
    console.log("SUBMIT FORM ON EDIT::", check);
    if (check) {
        setCanSubmit(false);

        const editProduct = httpsCallable<
            ProductEditFields,
            ResponseData<string>
        >(functions, "editProduct");
        editProduct(formatedData)
            .then((result) => {
                const { msg, error: isError, extra } = result.data;

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra);
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

export const deleteProduct = (
    data: {
        formatedData: ProductDeleteFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: string) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = checkDeleteProductFields(formatedData);
    console.log("SUBMIT FORM ON DELETE::", check);
    if (check) {
        setCanSubmit(false);

        const deleteProduct = httpsCallable<
            ProductDeleteFields,
            ResponseData<string>
        >(functions, "deleteProduct");
        deleteProduct(formatedData)
            .then((result) => {
                const { msg, error: isError, extra } = result.data;
                console.log(result.data);

                setMessage({ msg, isError });
                if (!isError) {
                    onSuccess(extra);
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

export const editProductList = (
    data: {
        formatedData: UpdateProductVendorFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: string) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

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
                const { msg, error: isError, extra } = result.data;

                console.log(result.data);
                setMessage({ msg, isError });

                onSuccess(extra as string);
            })
            .catch((error) => {
                console.log(error);
                setCanSubmit(true);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .finally(() => setCanSubmit(true));
    }
};

export const loadVendorProduct = (
    data: {
        formatedData: ProductListFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: ProductListData) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    const check = formatedData.token != null && formatedData.token != "";
    console.log("SUBMIT FORM LOAD VENDOR::", check);
    if (check) {
        setCanSubmit(false);

        const getProductVendor = httpsCallable<
            ProductListFields,
            ResponseData<ProductListData>
        >(functions, "getProductVendor");
        getProductVendor(formatedData)
            .then((result) => {
                const { msg, error: isError, extra } = result.data;

                onSuccess(extra);
                if (isError) {
                    setMessage({ msg, isError });
                }
            })
            .catch((error) => {
                console.log(error);
                setCanSubmit(true);
                setMessage({ msg: messagesCode["ERR00"], isError: error });
            })
            .finally(() => setCanSubmit(true));
    }
};
