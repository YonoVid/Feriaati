import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { Card } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ResponseData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullProductVendorFields,
    UpdateFullVendorFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import VendorList from "@feria-a-ti/web/src/components/vendorList/VendorList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";
import { checkProductVendorFullUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";
import AdminVendorUpdateForm from "../../components/forms/adminVendorUpdateForm/AdminVendorUpdateForm";

const AdminVendorPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    //Selected product list data
    const [selectedVendor, setselectedVendor] = useState<
        VendorData | undefined
    >(undefined);
    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorData[]>([]);

    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (vendors == [] || selectedVendor == undefined) {
            getVendors();
        }
    }, []);

    const getVendors = async () => {
        try {
            const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
                functions,
                "vendorList"
            );
            vendors(authToken).then((response) => {
                const vendorsData = response.data.extra as VendorData[];
                setVendors(vendorsData);
                console.log("VENDORS DATA::", vendorsData);
            });
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const updateVendor = async (data: FieldValues) => {
        try {
            const formatedData: UpdateFullVendorFields = {
                adminToken: authToken || "",
                id: selectedVendor?.id as string,
                email: data.email || selectedVendor?.email,
                password: data.password || selectedVendor?.password,
                name: data.name || selectedVendor?.name,
                surname: data.surname || selectedVendor?.surname,
            };
            const check = checkProductVendorFullUpdate(formatedData);
            console.log("VENDOR FULL UPDATE CHECK::", check);
            if (check) {
                setCanSubmit(false);
                const updateState = httpsCallable<
                    UpdateFullProductVendorFields,
                    ResponseData<null>
                >(functions, "updateVendor");

                updateState(formatedData)
                    .then((response) => {
                        const { msg, error } = response.data;
                        console.log(response.data);
                        setMessage({ msg, isError: error });
                        if (!error) {
                            setselectedVendor(undefined);
                            getVendors();
                        }
                    })
                    .finally(() => setCanSubmit(true));
            }
        } catch (error) {
            console.error("Error al actualizar el estado del local:", error);
        }
    };

    const deleteselectedVendor = async (id: string) => {
        try {
            const updateState = httpsCallable<DeleteFields, ResponseData<null>>(
                functions,
                "deleteselectedVendor"
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
            {selectedVendor ? (
                <AdminVendorUpdateForm
                    canSubmit={canSubmit}
                    vendor={selectedVendor}
                    onCancel={() => setselectedVendor(undefined)}
                    onSubmit={updateVendor}
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
                        onEdit={(data) => setselectedVendor(data)}
                        onDelete={(id: string) => deleteselectedVendor(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminVendorPage;
