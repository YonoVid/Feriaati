import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import { Card } from "@mui/material";

import { VendorData } from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullVendorFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import {
    deleteVendor,
    editVendor,
    getVendorList,
} from "@feria-a-ti/common/functions/admin/adminVendorFunctions";

import VendorList from "@feria-a-ti/web/src/components/vendorList/VendorList";
import AdminVendorUpdateForm from "@feria-a-ti/web/src/components/forms/adminVendorUpdateForm/AdminVendorUpdateForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";

const AdminVendorPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    //Selected product list data
    const [selectedVendor, setselectedVendor] = useState<
        VendorData | undefined
    >(undefined);
    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorData[]>([]);

    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (vendors.length == 0 || selectedVendor == undefined) {
            getVendors();
        }
    }, []);

    const getVendors = async () => {
        const formatedData: string = authToken as string;

        getVendorList(
            { formatedData, setCanSubmit, setMessage },
            (value: VendorData[]) => {
                setVendors(value);
            }
        );
    };

    const updateSubmit = async (data: FieldValues) => {
        const formatedData: UpdateFullVendorFields = {
            adminToken: authToken || "",
            id: selectedVendor?.id as string,
            email: data.email || selectedVendor?.email,
            password: data.password || selectedVendor?.password,
            name: data.name || selectedVendor?.name,
            surname: data.surname || selectedVendor?.surname,
        };

        editVendor({ formatedData, setCanSubmit, setMessage }, () => {
            setselectedVendor(undefined);
            getVendors();
        });
    };

    const deleteSubmit = async (id: string) => {
        const formatedData: DeleteFields = {
            email: emailUser as string,
            token: authToken as string,
            itemId: id,
        };

        deleteVendor({ formatedData, setCanSubmit, setMessage }, () => {
            setVendors(vendors.filter((value) => value.id !== id));
        });
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            {selectedVendor ? (
                <AdminVendorUpdateForm
                    canSubmit={canSubmit}
                    vendor={selectedVendor}
                    onCancel={() => setselectedVendor(undefined)}
                    onSubmit={updateSubmit}
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
                        onDelete={(id: string) => deleteSubmit(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminVendorPage;
