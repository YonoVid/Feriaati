import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import LoadingOverlay from "react-loading-overlay-ts";

import { Hidden } from "@mui/material";

import {
    SubscriptionData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { GetAccountFields } from "@feria-a-ti/common/model/account/getAccountFields";

import { UserContext } from "@feria-a-ti/web/src/App";
import SubscriptionForm from "@feria-a-ti/web/src/components/forms/subscriptionForm/SubscriptionForm";
import { SubscriptionFields } from "@feria-a-ti/common/model/account/subscriptionAccountFields";
import {
    getSubscription,
    paySubscriptionWeb,
} from "@feria-a-ti/common/functions/payment/subscriptionFunctions";

import { useHeaderContext } from "../HeaderFunction";

const SubscriptionPage = () => {
    //Global UI context
    const { setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);
    //Navigation definition
    //const navigate = useNavigate();
    // Form variables
    const form: HTMLFormElement | null =
        document.querySelector("#transbankForm") || null;

    const [canSubmit, setCanSubmit] = useState(false);

    const [subscriptionData, setSubscriptionData] =
        useState<SubscriptionData>();

    const [response, setResponse] = useState<any>(null);

    useEffect(() => {
        getSubscriptionData();
    }, []);

    const getSubscriptionData = () => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: GetAccountFields = {
            token: authToken,
            email: emailUser as string,
            type: type,
        };

        getSubscription(
            { formatedData, setCanSubmit, setMessage },
            (value: SubscriptionData) => {
                setSubscriptionData(value);
            }
        );
    };

    const onClick = (data: FieldValues) => {
        const formatedData: SubscriptionFields = {
            type: type,
            email: emailUser as string,
            token: authToken as string,
            amount: data.amount,
            months: data.months,
        };
        console.log("DATA::", formatedData);
        // Generate facture
        if (canSubmit && subscriptionData && subscriptionData != null) {
            const returnUrl =
                window.location.origin + "/transaction/subscription";

            paySubscriptionWeb(
                { formatedData, returnUrl, setCanSubmit, setMessage },
                (value: any) => {
                    setResponse(value);
                    console.log(value);
                    console.log(form);
                    if (value != null && form != null) {
                        console.log("SUBMIT FORM");

                        form.action = value.url;
                        form.onformdata = (ev) => {
                            ev.formData.set("token_ws", value.token);
                        };
                        form.requestSubmit();
                    }
                }
            );
        } else {
            setMessage({ msg: "Datos de pedido incorrectos", isError: true });
        }
    };

    return (
        <>
            {!(
                type === userType.user ||
                type === userType.vendor ||
                type === userType.contributor
            ) && <Navigate to="/login" replace={true} />}
            <Hidden>
                <form
                    id="transbankForm"
                    name="transbankForm"
                    method="post"
                    action={response ? response.url : ""}
                >
                    <input
                        type="hidden"
                        name="token_ws"
                        value={response ? response.token : ""}
                    />
                </form>
            </Hidden>
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Cargando datos..."
            >
                <SubscriptionForm
                    canSubmit={canSubmit}
                    subscription={subscriptionData}
                    onSubmit={onClick}
                />
            </LoadingOverlay>
        </>
    );
};

export default SubscriptionPage;
