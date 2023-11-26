import { ReactNode, useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkProductVendorUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";
import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";

import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductVendorPage";
import ProductVendorUpdateForm from "@feria-a-ti/web/src/components/forms/productVendorUpdateForm/ProductVendorUpdateForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

type ManagerProductListProps = {
    productVendor: ProductListCollectionData | undefined;
    products: ProductData[];
    canSubmit: boolean;
    setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    setProductEditable: React.Dispatch<
        React.SetStateAction<ProductData | null>
    >;
    loadVendor: () => void;
    onDelete: (id: string) => void;
    children: ReactNode;
};

function ManagerProductList(props: ManagerProductListProps) {
    const {
        productVendor,
        products,
        loadVendor,
        setProductEditable,
        canSubmit,
        setCanSubmit,
        onDelete,
        children,
    } = props;
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);
    // Dom redirection variable
    const navigate = useNavigate();

    //Page stored data

    // Form related variables;
    const [imageData, setImageData] = useState<string>("");

    const [updateVendorPage, setUpdateVendorPage] = useState(false);

    const onEditVendor = (data: FieldValues) => {
        const formatedData: UpdateProductVendorFields = {
            token: authToken as string,
            email: emailUser as string,
            productVendorId: productVendor?.vendorId as string,
            image:
                imageData && imageData != null && imageData != ""
                    ? imageData
                    : productVendor?.image,
            contactPhone: data.contactPhone as string,
            contactEmail: data.contactEmail as string,
            serviceTime: data.serviceTime as { start: DayTime; end: DayTime },
        };
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
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    //setIsLogged(result.data as any);
                    if (!error) {
                        setProductEditable(null);
                        loadVendor();
                        setImageData("");
                        setUpdateVendorPage(false);
                    }
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    return (
        <>
            {type !== userType.vendor && type !== userType.contributor && (
                <Navigate to="/session" replace={true} />
            )}
            {!updateVendorPage ? (
                <>
                    <ProductVendorPage
                        vendorId={productVendor?.vendorId as string}
                        vendorData={productVendor || {}}
                        products={products}
                        isEditable={true}
                        onAdd={() => navigate("/addProduct")}
                        onEdit={(data: ProductData) => {
                            setProductEditable(data);
                        }}
                        onUpdatePage={() => setUpdateVendorPage(true)}
                        onDelete={onDelete}
                    />
                    {children}
                </>
            ) : (
                <ProductVendorUpdateForm
                    imageData={productVendor?.image as string}
                    canSubmit={canSubmit}
                    buttonLabel="Actualizar local"
                    editedVendor={productVendor}
                    setImageData={setImageData}
                    onSubmit={onEditVendor}
                    onCancel={() => {
                        setUpdateVendorPage(false);
                        setImageData("");
                    }}
                />
            )}
        </>
    );
}
export default ManagerProductList;
