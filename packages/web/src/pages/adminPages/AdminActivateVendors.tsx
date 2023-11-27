import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { Card } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ResponseData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";
import { UpdateStateFields } from "@feria-a-ti/common/model/fields/adminFields";
import { userStatus } from "@feria-a-ti/common/model/fields/registerFields";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import RegisterVendorList from "../../components/vendorList/RegisterVendorList";

const AdminActivateVendors = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    // Data of vendors stored
    const [newVendors, setNewVendors] = useState<VendorData[]>([]);

    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (newVendors.length == 0) {
            getNewVendors();
        }
    }, []);

    const getNewVendors = async () => {
        try {
            const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
                functions,
                "registerVendorList"
            );
            vendors(authToken).then((response) => {
                const vendorsData = response.data.extra as VendorData[];
                setNewVendors(vendorsData);
                console.log("NEW VENDORS DATA::", vendorsData);
            });
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
            console.log("SELECTED USER::", id);
            updateState({ token: authToken as string, itemId: id, status })
                .then((response) => {
                    const { msg, error } = response.data;
                    console.log(response.data);
                    setMessage({ msg, isError: error });
                    if (!error) {
                        setNewVendors(
                            newVendors.filter((value) => value.id !== id)
                        );
                    }
                })
                .finally(() => setCanSubmit(true));
            // .finally(() => setShowAlert(true));
        } catch (error) {
            console.error("Error al actualizar el estado del vendedor:", error);
        }
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            {newVendors && (
                <Card
                    className="inputContainer"
                    color="secondary"
                    sx={{
                        maxWidth: "80%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                >
                    <h1 style={{ maxWidth: "100%" }}>{"Solicitudes"}</h1>
                    <RegisterVendorList
                        vendors={newVendors}
                        canSubmit={canSubmit}
                        updateState={updateState}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminActivateVendors;
