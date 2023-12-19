import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import { Card } from "@mui/material";

import { ProductListData } from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullProductVendorFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import {
    deleteProductList,
    editProductList,
    getProductList,
} from "@feria-a-ti/common/functions/admin/adminProductListFunctions";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";

import AdminProductListUpdateForm from "@feria-a-ti/web/src/components/forms/adminProductListUpdateForm/AdminProductListUpdateForm";
import ProductVendorList from "@feria-a-ti/web/src/components/productVendorList/ProductVendorList";

import { UserContext } from "@feria-a-ti/web/src/App";

const AdminProductsPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    //Selected product list data
    const [productList, setProductList] = useState<ProductListData | undefined>(
        undefined
    );
    // Data of vendors stored
    const [vendors, setVendors] = useState<ProductListData[]>([]);

    const [imageData, setImageData] = useState<string>("");
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (vendors.length == 0 || productList == undefined) {
            getVendors();
        }
    }, []);

    const getVendors = async () => {
        const formatedData: string = authToken as string;

        getProductList(
            { formatedData, setCanSubmit, setMessage },
            (value: ProductListData[]) => {
                setVendors(value);
            }
        );
    };

    const updateProductList = async (data: FieldValues) => {
        const formatedData: UpdateFullProductVendorFields = {
            adminToken: authToken || "",
            id: productList?.id as string,
            enterpriseName: data.enterpriseName || productList?.enterpriseName,
            rut: data.rut || productList?.rut,
            localNumber: data.localNumber || productList?.localNumber,
            street: data.street || productList?.street,
            streetNumber: data.streetNumber || productList?.streetNumber,
            region: data.region || productList?.region,
            commune: data.commune || productList?.commune,
            image: imageData || productList?.image,
            serviceTime: data.serviceTime || productList?.serviceTime,
            contact:
                { email: data.contactEmail, phone: data.contactPhone } ||
                productList?.contact,
        };

        editProductList({ formatedData, setCanSubmit, setMessage }, () => {
            setProductList(undefined);
            getVendors();
        });
    };

    const deleteSubmit = async (id: string) => {
        const formatedData: DeleteFields = {
            email: emailUser as string,
            token: authToken as string,
            itemId: id,
        };

        deleteProductList({ formatedData, setCanSubmit, setMessage }, () => {
            setVendors(vendors.filter((value) => value.id !== id));
        });
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            {productList ? (
                <AdminProductListUpdateForm
                    canSubmit={canSubmit}
                    imageData={imageData}
                    setImageData={setImageData}
                    productList={productList}
                    onCancel={() => setProductList(undefined)}
                    onSubmit={updateProductList}
                />
            ) : (
                <Card
                    className="inputContainer"
                    color="secondary"
                    sx={{
                        maxWidth: "80%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                >
                    <h1 style={{ maxWidth: "100%" }}>{"Lista de Tiendas"}</h1>
                    <ProductVendorList
                        productVendors={vendors}
                        onEdit={(data) => setProductList(data)}
                        onDelete={(id: string) => deleteSubmit(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminProductsPage;
