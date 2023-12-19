import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { useHeaderContext } from "../HeaderFunction";

import { Box, Button, Card, LinearProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { TransbankTransaction } from "@feria-a-ti/common/model/account/paymenTypes";

import { UserContext } from "@feria-a-ti/web/src/App";

import {
    FactureStatusFields,
    getFactureStatus,
} from "@feria-a-ti/common/functions/factureFunctions";

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

        const formatedData: FactureStatusFields = {
            token: authToken as string,
            type: type,
            transactionToken: token as string,
            factureType: factureType as string,
        };

        getFactureStatus(
            { formatedData, setCanSubmit, setMessage },
            (value: TransbankTransaction) => {
                setTransaction(value);

                if (value.response_code == 0) {
                    resetProduct();
                }
            }
        );
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
