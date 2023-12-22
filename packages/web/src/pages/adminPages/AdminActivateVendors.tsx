import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { Card } from "@mui/material";

import LoadingOverlay from "react-loading-overlay-ts";

import { VendorData } from "@feria-a-ti/common/model/functionsTypes";
import { UpdateStateFields } from "@feria-a-ti/common/model/fields/adminFields";
import { userStatus } from "@feria-a-ti/common/model/fields/registerFields";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import RegisterVendorList from "../../components/vendorList/RegisterVendorList";
import {
    editVendorState,
    getNewVendorList,
} from "@feria-a-ti/common/functions/admin/adminVendorFunctions";

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
        const formatedData: string = authToken as string;

        getNewVendorList(
            { formatedData, setCanSubmit, setMessage },
            (value: VendorData[]) => {
                setNewVendors(value);
                console.log("NEW VENDORS DATA::", value);
            }
        );
    };

    const updateState = async (id: string, status: userStatus) => {
        if (id != null && id !== "" && status) {
            const formatedData: UpdateStateFields = {
                token: authToken as string,
                itemId: id,
                status,
            };

            editVendorState({ formatedData, setCanSubmit, setMessage }, () => {
                setNewVendors(newVendors.filter((value) => value.id !== id));
            });
        }
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
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
            </LoadingOverlay>
        </>
    );
};

export default AdminActivateVendors;
