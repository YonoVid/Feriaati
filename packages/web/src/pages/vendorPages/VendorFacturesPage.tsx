import { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import { FactureData, userType } from "@feria-a-ti/common/model/functionsTypes";
import { FactureFields } from "@feria-a-ti/common/model/fields/factureFields";

import { getVendorFactures } from "@feria-a-ti/common/functions/factureFunctions";

import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderFunction";
import FacturesList from "../../components/factureList/FacturesList";
import "../../App.css";

function VendorFacturesPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authUser, authToken, emailUser, type } = useContext(UserContext);
    //UI variables
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    // Retrived data
    const [factures, setFactures] = useState<Array<FactureData>>([]);

    const loadFactures = (index: number) => {
        setCanSubmit(false);

        console.log("LOAD FACTURES");
        const formatedData: FactureFields = {
            email: emailUser as string,
            token: authToken as string,
            index: index,
            size: 10,
        };

        getVendorFactures(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                setFactures && setFactures(factures.concat(data));
            }
        );
    };

    useEffect(() => {
        if (factures.length < 1) {
            loadFactures(0);
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
                <FacturesList
                    userId={authUser || "userId"}
                    factures={factures}
                    label="Facturas de compras"
                    loadData={loadFactures}
                />
            </LoadingOverlay>
        </>
    );
}
export default VendorFacturesPage;
