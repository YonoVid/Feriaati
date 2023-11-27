import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useHeaderContext } from "../HeaderFunction";
import { httpsCallable } from "firebase/functions";
import { functions } from "@feria-a-ti/common/firebase";
import {
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { Box, Button, Card, LinearProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
// import DeleteIcon from "@mui/icons-material/Delete";

import {
    FactureStatus,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { TransbankTransaction } from "@feria-a-ti/common/model/account/paymenTypes";

import { UserContext } from "@feria-a-ti/web/src/App";
import {
    FactureTypes,
    UpdateFactureFields,
} from "@feria-a-ti/common/model/fields/buyingFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";

const FactureStatusPage = () => {
    //Global UI context
    const { setMessage, resetProduct } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Form variables
    const [canSubmit, setCanSubmit] = useState(false);

    // Transaction data
    const [transaction, setTransaction] = useState<
        TransbankTransaction | undefined
    >();
    // Url query data getter
    const [queryParams] = useSearchParams();
    const { type: factureType } = useParams();

    useEffect(() => {
        const token = queryParams.get("token_ws");
        console.log("TOKEN_WS::" + token);
        console.log("TOKEN_WS::" + factureType);
        if (
            token &&
            token != "" &&
            Object.values<string>(FactureTypes).includes(factureType as string)
        ) {
            const tx = new WebpayPlus.Transaction(
                new Options(
                    IntegrationCommerceCodes.WEBPAY_PLUS,
                    IntegrationApiKeys.WEBPAY,
                    "/api" // Environment.Integration
                )
            );
            tx.commit(token)
                .then((value: TransbankTransaction) => {
                    console.log("TOKEN RESPONSE::", value);

                    setTransaction(value);

                    if (value != undefined && value != null) {
                        let status = FactureStatus.NEGATED;
                        if (value.response_code == 0) {
                            resetProduct();
                            status = FactureStatus.APPROVED;
                        }

                        const updateFacture = httpsCallable<
                            UpdateFactureFields,
                            ResponseData<string>
                        >(functions, "updateUserFacture");

                        const formatedData: UpdateFactureFields = {
                            token: authToken as string,
                            userType: type,
                            facture: value.buy_order,
                            status: status,
                            type: factureType as FactureTypes,
                        };

                        console.log(formatedData);

                        updateFacture(formatedData)
                            .then((result) => {
                                const { msg, error } = result.data;
                                console.log(result);
                                //Show alert message
                                setMessage({ msg, isError: error });
                            })
                            .catch((error) => {
                                console.log(error);
                                setMessage({
                                    msg: messagesCode["ERR00"],
                                    isError: error,
                                });
                            });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    }, []);

    return (
        <>
            <Card
                className="inputContainer"
                sx={{
                    maxWidth: "50%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1 style={{ maxWidth: "100%" }}>Resultado de transacción</h1>
                {transaction == undefined ? (
                    <LinearProgress />
                ) : (
                    <Box>
                        {transaction != undefined &&
                        transaction.response_code == 0 ? (
                            <>
                                <h2>Transacción exitosa</h2>
                                <CheckCircleOutlineIcon />
                            </>
                        ) : (
                            <>
                                <h2>Transacción fallida,</h2>
                                <h2>vuelva a intentarlo más tarde</h2>
                                <ErrorOutlineIcon />
                            </>
                        )}
                    </Box>
                )}

                <Box sx={{ margin: "1em" }}>
                    <Button
                        onClick={() => {
                            if (
                                transaction != undefined ||
                                transaction!.response_code == 0
                            ) {
                                navigate("/home");
                            } else {
                                navigate("shoppingCart");
                            }
                        }}
                        type="submit"
                        variant="contained"
                        disabled={!canSubmit || false}
                    >
                        Volver al inicio
                    </Button>
                </Box>
            </Card>
        </>
    );
};

export default FactureStatusPage;
