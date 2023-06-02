import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkAddProductFields } from "@feria-a-ti/common/check/checkProductFields";
import {
    ProductData,
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";
import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";
import {
    ProductFields,
    ProductListFields,
} from "@feria-a-ti/common/model/productAddFormProps";

function ManagerVendorPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    // //Router dom
    // const navigate = useNavigate();
    const [products, setProducts] = useState<Array<ProductData>>([]);

    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);
    //const [isLogged, setIsLogged] = useState(false);
    // Form related variables;
    const [canSubmit, setCanSubmit] = useState(true);

    const loadProducts = () => {
        const formatedData: ProductListFields = {
            tokenVendor: authToken as string,
        };
        const check = authToken != null && authToken != "";
        console.log("SUBMIT FORM::", check);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductData>
            >(functions, "listProduct");
            addProduct(formatedData).then((result) => {
                const { msg, error } = result.data as ResponseData<string>;
                console.log(result.data);

                setProducts(products);
                //setIsLogged(result.data as any);
                if (msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    const onSubmit = (data: FieldValues) => {
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
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const addProduct = httpsCallable<
                ProductFields,
                ResponseData<string>
            >(functions, "addProduct");
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error, extra } =
                        result.data as ResponseData<string>;
                    console.log(result.data);

                    const product: ProductData = {
                        name: formatedData.name,
                        description: formatedData.description,
                        price: formatedData.price,
                        discount: formatedData.discount,
                        promotion: formatedData.promotion as number,
                        image: imageData,
                        id: extra,
                    };
                    setProducts(products.concat(product));
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    useEffect(() => {
        loadProducts();
    });
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
export default ManagerVendorPage;
