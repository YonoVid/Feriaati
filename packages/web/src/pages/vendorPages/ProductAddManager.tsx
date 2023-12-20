import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import { userType } from "@feria-a-ti/common/model/functionsTypes";
import { ProductFields } from "@feria-a-ti/common/model/props/productAddFormProps";
import { addProduct } from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";
import "@feria-a-ti/web/src/App.css";

function ProductAddManager() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Router dom
    const navigate = useNavigate();

    // const { handleSubmit, watch, control } = useForm<ProductFields>({
    //     defaultValues: { discount: "none" },
    // });

    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: FieldValues) => {
        const formatedData: ProductFields = {
            tokenVendor: authToken as string,
            name: data.name as string,
            description: data.description as string,
            unit: data.unit,
            unitType: data.unitType,
            price: data.price as number,
            discount: data.discount,
            promotion: data.promotion as number,
            image: imageData,
        };

        addProduct({ formatedData, setCanSubmit, setMessage }, () => {
            navigate("/managerVendor");
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
                <ProductAddForm
                    label="Nuevo producto"
                    buttonLabel="Agregar producto"
                    imageData={imageData}
                    setImageData={setImageData}
                    onSubmit={onSubmit}
                    onCancel={() => navigate("/managerVendor")}
                    canSubmit={canSubmit}
                />
            </LoadingOverlay>
        </>
    );
}
export default ProductAddManager;
