import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import {
    checkAddProductFields,
    checkDeleteProductFields,
} from "@feria-a-ti/common/check/checkProductFields";
import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductListFields,
} from "@feria-a-ti/common/model/productAddFormProps";
import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";
import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductPage";
import ProductVendorUpdateForm from "@feria-a-ti/web/src/components/forms/productVendorUpdateForm/ProductVendorUpdateForm";
import CommentList from "@feria-a-ti/web/src/components/commentList/CommentList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

function ManagerVendorPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    // Dom redirection variable
    const navigate = useNavigate();

    //Page stored data
    const [productVendor, setProductVendor] =
        useState<ProductListCollectionData>();
    const [products, setProducts] = useState<Array<ProductData>>([]);

    const [imageData, setImageData] = useState<[string, string, string]>([
        "",
        "",
        "",
    ]);

    const [productEditable, setProductEditable] = useState<ProductData | null>(
        null
    );

    // Form related variables;
    const [updateVendorPage, setUpdateVendorPage] = useState(false);

    const [canSubmit, setCanSubmit] = useState(true);

    const loadVendor = () => {
        const formatedData: ProductListFields = {
            tokenVendor: authToken as string,
        };
        const check = authToken != null && authToken != "";
        console.log("SUBMIT FORM::", check);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductListCollectionData>
            >(functions, "getProductVendor");
            addProduct(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setProductVendor(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

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
                const { msg, error, extra } = result.data as ResponseData<
                    ProductData[]
                >;
                console.log(result.data);

                setProducts(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    const onEdit = (data: FieldValues) => {
        const formatedData: ProductEditFields = {
            id: productEditable?.id as string,
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
            const editProduct = httpsCallable<
                ProductEditFields,
                ResponseData<string>
            >(functions, "editProduct");
            editProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    //setIsLogged(result.data as any);
                    if (!error) {
                        setProductEditable(null);
                        loadProducts();
                    }
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    const onDelete = (id: string) => {
        const formatedData: ProductDeleteFields = {
            tokenVendor: authToken as string,
            productId: id,
        };
        const check = checkDeleteProductFields(formatedData);
        console.log("SUBMIT FORM::", check);
        if (check) {
            setCanSubmit(false);
            const addProduct = httpsCallable<
                ProductDeleteFields,
                ResponseData<string>
            >(functions, "deleteProduct");
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result.data);

                    !error &&
                        setProducts(
                            products.filter(
                                (product) =>
                                    product.id !== formatedData.productId
                            )
                        );
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    useEffect(() => {
        if (!productVendor || productVendor == null) {
            loadVendor();
            loadProducts();
        } else if (!products || products == null) {
            loadProducts();
        }
    }, []);
    return (
        <>
            {type !== "vendor" && <Navigate to="/session" replace={true} />}
            {!productEditable ? (
                !updateVendorPage ? (
                    <>
                        <ProductVendorPage
                            vendorData={productVendor || {}}
                            isEditable={true}
                            products={products}
                            onAdd={() => navigate("/addProduct")}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onUpdatePage={() => setUpdateVendorPage(true)}
                        />
                        <CommentList commentsVendor="" isUser={false} />
                    </>
                ) : (
                    <ProductVendorUpdateForm
                        imageData={productVendor?.image as string}
                        buttonLabel="Actualizar local"
                        editedVendor={productVendor}
                        onSubmit={(data) => onEdit(data)}
                        onCancel={() => setUpdateVendorPage(false)}
                    />
                )
            ) : (
                <ProductAddForm
                    editableState={productEditable}
                    imageData={imageData}
                    setImageData={setImageData}
                    onSubmit={onEdit}
                    onCancel={() => setProductEditable(null)}
                    canSubmit={canSubmit}
                    buttonLabel={"Editar producto"}
                />
            )}
        </>
    );
}
export default ManagerVendorPage;
