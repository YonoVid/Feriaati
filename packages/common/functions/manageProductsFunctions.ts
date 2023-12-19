import { functions } from "@feria-a-ti/common/firebase";
import { httpsCallable } from "@firebase/functions";

import {
    checkAddProductFields,
    checkDeleteProductFields,
} from "../check/checkProductFields";
import {
    ProductData,
    ProductListData,
    ResponseData,
} from "../model/functionsTypes";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductListFields,
} from "../model/props/productAddFormProps";

export const loadVendorProduct = (
    data: {
        formatedData: ProductListFields;
    },
    onSuccess: (data: ResponseData<ProductListData>) => void
) => {
    const { formatedData } = data;

    const check = formatedData.token != null && formatedData.token != "";
    console.log("SUBMIT FORM LOAD VENDOR::", check);
    if (check) {
        const getProductVendor = httpsCallable<
            ProductListFields,
            ResponseData<ProductListData>
        >(functions, "getProductVendor");
        getProductVendor(formatedData).then((result) => {
            console.log(result.data);

            onSuccess(result.data);
        });
    }
};

export const listProducts = (
    data: {
        formatedData: ProductListFields;
    },
    onSuccess: (data: ResponseData<ProductData[]>) => void
) => {
    const { formatedData } = data;

    const check = formatedData.token != null && formatedData.token != "";
    console.log("SUBMIT FORM LOAD PRODUCTS::", check);
    if (check) {
        const listProduct = httpsCallable<
            ProductListFields,
            ResponseData<ProductData[]>
        >(functions, "listProduct");
        listProduct(formatedData).then((result) => {
            console.log(result.data);

            onSuccess(result.data);
        });
    }
};

export const updateProduct = (
    data: {
        formatedData: ProductEditFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit } = data;

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
                console.log(result.data);
                onSuccess(result.data);
            })
            .catch(() => {
                // setMessage({
                //     msg: "Error de conexión con el servidor",
                //     isError: true,
                // });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};

export const deleteProduct = (
    data: {
        formatedData: ProductDeleteFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    const { formatedData, setCanSubmit } = data;

    const check = checkDeleteProductFields(formatedData);
    console.log("SUBMIT FORM ON DELETE::", check);
    if (check) {
        setCanSubmit(false);
        const addProduct = httpsCallable<
            ProductDeleteFields,
            ResponseData<string>
        >(functions, "deleteProduct");
        addProduct(formatedData)
            .then((result) => {
                console.log(result.data);

                onSuccess(result.data);
            })
            .catch(() => {
                // setMessage({
                //     msg: "Error de conexión con el servidor",
                //     isError: true,
                // });
                setCanSubmit(true);
            })
            .finally(() => setCanSubmit(true));
    }
};
