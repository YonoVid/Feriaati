import { ReactNode, useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import {
    ProductData,
    ProductListCollectionData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

import { editProductList } from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductVendorPage";
import ProductVendorUpdateForm from "@feria-a-ti/web/src/components/forms/productVendorUpdateForm/ProductVendorUpdateForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";
import "@feria-a-ti/web/App.css";

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

        editProductList({ formatedData, setCanSubmit, setMessage }, () => {
            setProductEditable(null);
            loadVendor();
            setImageData("");
            setUpdateVendorPage(false);
        });
    };

    return (
        <>
            {type !== userType.vendor && type !== userType.contributor && (
                <Navigate to="/session" replace={true} />
            )}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
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
                        label="Actualizar puesto"
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
            </LoadingOverlay>
        </>
    );
}
export default ManagerProductList;
