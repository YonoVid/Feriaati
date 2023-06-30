import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { Card } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ProductListData,
    ResponseData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteProductVendorFields,
    UpdateFullProductVendorFields,
    UpdateStateFields,
} from "@feria-a-ti/common/model/fields/adminFields";
import { userStatus } from "@feria-a-ti/common/model/fields/registerFields";

import VendorList from "@feria-a-ti/web/src/components/vendorList/VendorList";
import RegisterVendorList from "@feria-a-ti/web/src/components/vendorList/RegisterVendorList";
import AdminVendorUpdateForm from "@feria-a-ti/web/src/components/forms/adminVendorUpdateForm/AdminVendorUpdateForm";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import { checkProductVendorFullUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";

const AdminStatePage = () => {
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
    const [newVendors, setNewVendors] = useState<VendorData[]>([]);

    const [imageData, setImageData] = useState<string>("");
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (productList == undefined) {
            getNewVendors();
        }
        if (vendors == []) {
            getVendors();
        }
    }, [productList]);

    const getVendors = async () => {
        try {
            const vendors = httpsCallable(functions, "registerVendorList");
            const response = await vendors();
            const vendorsData = response.data as VendorData[];
            setNewVendors(vendorsData);
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const getNewVendors = async () => {
        try {
            const vendors = httpsCallable(functions, "productVendorList");
            const response = await vendors();
            const vendorsData = response.data as ProductListData[];
            setVendors(vendorsData);
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const updateState = async (id: string, status: userStatus) => {
        try {
            const updateState = httpsCallable<
                UpdateStateFields,
                ResponseData<null>
            >(functions, "vendorStateUpdate");
            updateState({ id, email: id, status })
                .then((response) => {
                    const { msg, error } = response.data;
                    console.log(response.data);
                    setMessage({ msg, isError: error });
                })
                .finally(() => setCanSubmit(true));
            // .finally(() => setShowAlert(true));
        } catch (error) {
            console.error("Error al actualizar el estado del vendedor:", error);
        }
    };

    const updateProductList = async (data: FieldValues) => {
        try {
            const formatedData: UpdateFullProductVendorFields = {
                adminToken: authToken || "",
                id: productList?.id as string,
                vendorId: productList?.vendorId,
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
            const updateState = httpsCallable<
                DeleteProductVendorFields,
                ResponseData<null>
            >(functions, "deleteProductList");

            updateState({
                adminToken: authToken as string,
                productVendorId: id,
            }).then((response) => {
                const { msg, error } = response.data;
                console.log(response.data);
                setMessage({ msg, isError: error });
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
                <AdminVendorUpdateForm
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
                    <h1 style={{ maxWidth: "100%" }}>
                        {"Lista de Vendedores"}
                    </h1>
                    <VendorList
                        vendors={vendors}
                        onEdit={(data) => setProductList(data)}
                        onDelete={(id: string) => deleteProductList(id)}
                    />
                    <h1 style={{ maxWidth: "100%" }}>{"Solicitudes"}</h1>
                    <RegisterVendorList
                        vendors={newVendors}
                        updateState={updateState}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminStatePage;
