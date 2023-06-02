import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkAddProductFields } from "@feria-a-ti/common/check/checkProductFields";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";
import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";
import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";

function VendorLoginPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    // //Router dom
    // const navigate = useNavigate();
    const [products, setProducts] = useState<Array<ProductFields>>([]);

    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmit = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: ProductFields = {
            tokenVendor: authToken as string,
            name: data.name as string,
            description: data.description as string,
            price: data.price as number,
            discount: data.discount,
            promotion: data.promotion as number,
            image: imageData,
        };
        const check = checkAddProductFields(formatedData);
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

                    setProducts(products.concat(formatedData));
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };
    return (
        <>
            {type !== "vendor" && <Navigate to="/session" replace={true} />}
            <ProductList label="" products={products} onSubmit={onSubmit} />
            <ProductAddForm
                imageData={imageData}
                setImageData={setImageData}
                onSubmit={onSubmit}
                canSubmit={canSubmit}
            />
        </>
    );
}
export default VendorLoginPage;
