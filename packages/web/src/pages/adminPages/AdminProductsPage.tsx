import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { Card } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ProductListData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullProductVendorFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import VendorList from "@feria-a-ti/web/src/components/vendorList/VendorList";
import AdminProductListUpdateForm from "@feria-a-ti/web/src/components/forms/adminProductListUpdateForm/AdminProductListUpdateForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import { checkProductVendorFullUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";
import ProductVendorList from "../../components/productVendorList/ProductVendorList";

const AdminProductsPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    //Selected product list data
    const [productList, setProductList] = useState<ProductListData | undefined>(
        undefined
    );
    // Data of vendors stored
    const [vendors, setVendors] = useState<ProductListData[]>([]);

    const [imageData, setImageData] = useState<string>("");
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (vendors == [] || productList == undefined) {
            getVendors();
        }
    }, []);

    const getVendors = async () => {
        try {
            const vendors = httpsCallable<
                string,
                ResponseData<ProductListData[]>
            >(functions, "productVendorList");
            vendors(authToken).then((response) => {
                const vendorsData = response.data.extra as ProductListData[];
                setVendors(vendorsData);
                console.log("VENDORS DATA::", vendorsData);
            });
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const updateProductList = async (data: FieldValues) => {
        try {
            const formatedData: UpdateFullProductVendorFields = {
                adminToken: authToken || "",
                id: productList?.id as string,
                enterpriseName:
                    data.enterpriseName || productList?.enterpriseName,
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
            const check = checkProductVendorFullUpdate(formatedData);
            console.log("PRODUCT VENDOR FULL UPDATE CHECK::", check);
            if (check) {
                setCanSubmit(false);
                const updateState = httpsCallable<
                    UpdateFullProductVendorFields,
                    ResponseData<null>
                >(functions, "updateProductList");

                updateState(formatedData)
                    .then((response) => {
                        const { msg, error } = response.data;
                        console.log(response.data);
                        setMessage({ msg, isError: error });
                        if (!error) {
                            setProductList(undefined);
                            getVendors();
                        }
                    })
                    .finally(() => setCanSubmit(true));
            }
        } catch (error) {
            console.error("Error al actualizar el estado del local:", error);
        }
    };

    const deleteProductList = async (id: string) => {
        try {
            const updateState = httpsCallable<DeleteFields, ResponseData<null>>(
                functions,
                "deleteProductList"
            );

            updateState({
                token: authToken as string,
                itemId: id,
            }).then((response) => {
                const { msg, error } = response.data;
                console.log(response.data);
                setMessage({ msg, isError: error });
                if (!error) {
                    setVendors(vendors.filter((value) => value.id !== id));
                }
            });
            // .finally(() => setShowAlert(true));
        } catch (error) {
            console.error("Error al actualizar el estado del local:", error);
        }
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
                        onDelete={(id: string) => deleteProductList(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminProductsPage;
