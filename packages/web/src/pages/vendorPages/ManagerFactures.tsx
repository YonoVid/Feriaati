import { ReactNode, useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { updateVendor } from "@feria-a-ti/common/functions/adminFunctions";
import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { UpdateProductVendorFields } from "@feria-a-ti/common/model/fields/updateFields";

import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductVendorPage";
import ProductVendorUpdateForm from "@feria-a-ti/web/src/components/forms/productVendorUpdateForm/ProductVendorUpdateForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";
import { DayTime } from "@feria-a-ti/common/model/baseTypes";

type ManagerFacturesProps = {
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

function ManagerFactures(props: ManagerFacturesProps) {
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
    const { authToken, emailUser } = useContext(UserContext);
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

        updateVendor({ formatedData, setCanSubmit }, (data) => {
            const { msg, error } = data as ResponseData<string>;
            console.log(data);
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
        });
    };

    return (
        <>
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
export default ManagerFactures;
