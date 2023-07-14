import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkAddProductFields } from "@feria-a-ti/common/check/checkProductFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import { ProductFields } from "@feria-a-ti/common/model/props/productAddFormProps";
import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

function ProductAddManager() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken } = useContext(UserContext);
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
        const check = checkAddProductFields(formatedData);
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const addProduct = httpsCallable<
                ProductFields,
                ResponseData<string>
            >(functions, "addProduct");
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                    !error && navigate("/managerVendor");
                })
                .finally(() => setCanSubmit(true));
        }
    };

    return (
        <>
            <ProductAddForm
                label="Nuevo producto"
                buttonLabel="Agregar producto"
                imageData={imageData}
                setImageData={setImageData}
                onSubmit={onSubmit}
                onCancel={() => navigate("/managerVendor")}
                canSubmit={canSubmit}
            />
        </>
    );
}
export default ProductAddManager;
