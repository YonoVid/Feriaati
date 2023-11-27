import { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import {
    FactureData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { FactureFields } from "@feria-a-ti/common/model/fields/factureFields";

import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderFunction";
import FacturesList from "../../components/factureList/FacturesList";
import "../../App.css";

function FacturesPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authUser, authToken, emailUser, type } = useContext(UserContext);
    //Navigation definition
    //const navigate = useNavigate();
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
        if (authUser != undefined || authUser != "") {
            const getFactures = httpsCallable(functions, "getFactures");
            getFactures(formatedData).then((result) => {
                const { msg, error, extra } = result.data as ResponseData<
                    Array<FactureData>
                >;
                console.log(result);
                //setIsLogged(result.data as any);
                setMessage({ msg, isError: error });
                if (!error) {
                    setFactures && setFactures(factures.concat(extra));
                }
            });
        }
    };

    useEffect(() => {
        if (factures.length < 1) {
            loadFactures(0);
        }
    }, []);

    return (
        <>
            {type === "vendor" && <Navigate to="/session" replace={true} />}
            <FacturesList
                userId={authUser || "userId"}
                factures={factures}
                label="Facturas de compras"
                loadData={loadFactures}
            />
        </>
    );
}
export default FacturesPage;
