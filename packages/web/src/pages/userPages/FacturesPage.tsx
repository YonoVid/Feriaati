import { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import { FactureData } from "@feria-a-ti/common/model/functionsTypes";
import { FactureFields } from "@feria-a-ti/common/model/fields/factureFields";

import { getFactures } from "@feria-a-ti/common/functions/factureFunctions";

import FacturesList from "@feria-a-ti/web/src/components/factureList/FacturesList";
import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";

import { UserContext } from "@feria-a-ti/web/src/App";
import "@feria-a-ti/web/src/App.css";

function FacturesPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authUser, authToken, emailUser, type } = useContext(UserContext);
    //Navigation definition
    //const navigate = useNavigate();
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    // Retrived data
    const [factures, setFactures] = useState<Array<FactureData>>([]);

    const loadFactures = (index: number) => {
        console.log("LOAD FACTURES");
        const formatedData: FactureFields = {
            email: emailUser as string,
            token: authToken as string,
            index: index,
            size: 10,
        };

        getFactures(
            { formatedData, setCanSubmit, setMessage },
            (value: Array<FactureData>) => {
                setFactures(factures.concat(value));
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
            {type === "vendor" && <Navigate to="/session" replace={true} />}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Cargando datos..."
            >
                <FacturesList
                    userId={authUser || "userId"}
                    factures={factures}
                    label="Facturas de compras"
                    loadData={loadFactures}
                    canSubmit={canSubmit}
                />
            </LoadingOverlay>
        </>
    );
}
export default FacturesPage;
