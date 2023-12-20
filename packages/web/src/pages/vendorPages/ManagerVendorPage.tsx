import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import {
    ProductData,
    ProductListData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    ProductDeleteFields,
    ProductEditFields,
    ProductListFields,
} from "@feria-a-ti/common/model/props/productAddFormProps";

import {
    editProduct,
    deleteProduct,
    listProducts,
    loadVendorProduct,
} from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductAddForm from "@feria-a-ti/web/src/components/forms/productAddForm/ProductAddForm";
import CommentList from "@feria-a-ti/web/src/components/commentList/CommentList";

import { UserContext } from "@feria-a-ti/web/src/App";
import ManagerProductList from "./ManagerProductList";
import { useHeaderContext } from "../HeaderFunction";
import "../../App.css";

function ManagerVendorPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);
    // Dom redirection variable
    //const navigate = useNavigate();

    //Page stored data
    const [productVendor, setProductVendor] = useState<ProductListData>();
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
    const [canSubmit, setCanSubmit] = useState(true);

    const loadVendor = () => {
        const formatedData: ProductListFields = {
            token: authToken as string,
            email: emailUser as string,
        };

        loadVendorProduct(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                setProductVendor(data);
            }
        );
    };

    const loadProducts = () => {
        const formatedData: ProductListFields = {
            token: authToken as string,
            email: emailUser as string,
        };

        listProducts({ formatedData, setCanSubmit, setMessage }, (data) => {
            setProducts(data);
        });
    };

    const onEdit = (data: FieldValues) => {
        console.log("IMAGE DATA::", imageData);
        const formatedData: ProductEditFields = {
            id: productEditable?.id as string,
            tokenVendor: authToken as string,
            name: data.name as string,
            description: data.description as string,
            unitType: data.unitType,
            unit: data.unit as number,
            price: data.price as number,
            discount: data.discount,
            promotion: data.promotion as number,
            image: imageData,
        };

        editProduct({ formatedData, setCanSubmit, setMessage }, () => {
            setProductEditable(null);
            loadProducts();
        });
    };

    const onDelete = (id: string) => {
        const formatedData: ProductDeleteFields = {
            token: authToken as string,
            email: emailUser as string,
            idProducts: id,
        };

        deleteProduct({ formatedData, setCanSubmit, setMessage }, () => {
            setProducts(
                products.filter(
                    (product) => product.id !== formatedData.idProducts
                )
            );
        });
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
            {type !== userType.vendor && type !== userType.contributor && (
                <Navigate to="/session" replace={true} />
            )}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
                {!productEditable ? (
                    <ManagerProductList
                        productVendor={productVendor}
                        products={products}
                        canSubmit={canSubmit}
                        loadVendor={loadVendor}
                        setProductEditable={setProductEditable}
                        setCanSubmit={setCanSubmit}
                        onDelete={onDelete}
                    >
                        <CommentList
                            commentsVendor={productVendor?.id || ""}
                            isUser={false}
                        />
                    </ManagerProductList>
                ) : (
                    <ProductAddForm
                        label="Actualizar"
                        editableState={productEditable}
                        imageData={imageData}
                        setImageData={setImageData}
                        onSubmit={onEdit}
                        onCancel={() => setProductEditable(null)}
                        setCanSubmit={setCanSubmit}
                        canSubmit={canSubmit}
                        buttonLabel={"Editar producto"}
                    />
                )}
            </LoadingOverlay>
        </>
    );
}
export default ManagerVendorPage;
