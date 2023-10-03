import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useHeaderContext } from "../HeaderLayout";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Button, Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { userType } from "@feria-a-ti/common/model/functionsTypes";

import { UserContext } from "@feria-a-ti/web/src/App";

const BuyProductsPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Text input
    const [searchString, setSearchString] = useState("search");
    // Form variables
    const [canSubmit, setSubmitActive] = useState(true);

    const [response, setResponse] = useState<any>();

    const onClick = async () => {
        setSubmitActive(false);
        console.log("TRANSBANK TEST::");

        const amount = 1000;
        const buyOrder = "1234567890";
        const sessionId = authToken + "-1234567890";
        const returnUrl = window.location.href;

        const tx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                "/api" //Environment.Integration
            )
        );
        tx.create(buyOrder, sessionId, amount, returnUrl)
            .then((newResponse) => {
                setResponse(newResponse);
                console.log(newResponse);
            })
            .finally(() => setSubmitActive(true));
    };

    return (
        <>
            {type !== userType.user && <Navigate to="/login" replace={true} />}
            {response != undefined && response != null && (
                <form method="post" action={response.url}>
                    <input
                        type="hidden"
                        name="token_ws"
                        value={response.token}
                    />
                    <input type="submit" value="Ir a pagar" />
                </form>
            )}
            <Button disabled={!canSubmit} onClick={onClick}>
                TEST TRANSBANK
            </Button>
        </>
    );
};

export default BuyProductsPage;
