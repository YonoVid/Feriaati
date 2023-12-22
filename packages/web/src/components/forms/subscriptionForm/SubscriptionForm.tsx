import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardActions,
    Divider,
    Typography,
} from "@mui/material";
import { RSubscriptionFormProps } from "@feria-a-ti/common/model/props/subscriptionFormProps";

import { SubscriptionFormFields } from "@feria-a-ti/common/model/account/subscriptionAccountFields";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

import "./SubscriptionForm.css";
import InputRadioComponent from "../../inputRadioComponent/InputRadioComponent";

function SubscriptionForm(props: RSubscriptionFormProps) {
    const { subscription, onSubmit } = props;
    const { watch, handleSubmit, setValue, reset, clearErrors, control } =
        useForm<SubscriptionFormFields>({
            defaultValues: { amount: 2000, months: 1 },
        });

    useEffect(() => {
        if (subscription && subscription !== null) {
            setValue("amount", subscription?.amountBase);
            setValue("months", 1);
        }
    }, [subscription, setValue]);

    return (
        <>
            <Card
                className="inputContainer"
                sx={{
                    maxWidth: "60%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1
                    style={{
                        maxWidth: "80%",
                        textAlign: "center",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    Estado de subscripción
                </h1>
                {subscription != undefined && subscription != null ? (
                    <>
                        <p>Subscripcción actualmente válida hasta</p>
                        <p>
                            {subscription.expirationDate != undefined &&
                                subscription.expirationDate != null &&
                                new Date(
                                    subscription.expirationDate.seconds * 1000
                                ).toDateString()}
                        </p>
                    </>
                ) : (
                    <p>No existe una subscripcción actualmente válida</p>
                )}
            </Card>
            <Card
                className="inputContainer"
                sx={{
                    maxWidth: "60%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1
                    style={{
                        maxWidth: "80%",
                        textAlign: "center",
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    Selección de subscripción
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputRadioComponent
                        name="amount"
                        isSelected={watch("amount") == subscription?.amountBase}
                        onClick={() => {
                            if (subscription != null) {
                                setValue("amount", subscription?.amountBase);
                                setValue("months", 1);
                            }
                        }}
                    >
                        <>
                            <Typography>
                                Contratar subscripción mensual
                            </Typography>
                            {subscription != undefined &&
                                subscription != null && (
                                    <Typography>
                                        $
                                        {numberWithCommas(
                                            subscription?.amountBase
                                        )}
                                    </Typography>
                                )}
                        </>
                    </InputRadioComponent>

                    <InputRadioComponent
                        name="amount"
                        isSelected={watch("amount") == subscription?.amountYear}
                        onClick={() => {
                            if (subscription != null) {
                                setValue("amount", subscription?.amountYear);
                                setValue("months", 12);
                            }
                        }}
                    >
                        <>
                            <Typography>
                                Contratar subscripción anual
                            </Typography>
                            {subscription != undefined &&
                                subscription != null && (
                                    <Typography>
                                        $
                                        {numberWithCommas(
                                            subscription?.amountYear
                                        )}
                                        {" (-"}
                                        {
                                            ~~(
                                                ((subscription?.amountBase *
                                                    12 -
                                                    subscription?.amountYear) /
                                                    subscription?.amountBase) *
                                                12
                                            )
                                        }
                                        {"%)"}
                                    </Typography>
                                )}
                        </>
                    </InputRadioComponent>

                    <CardActions>
                        <>
                            <Button
                                sx={{
                                    borderRadius: "20em",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    fontSize: "1.3em",
                                    fontWeight: "bold",
                                }}
                                color="secondary"
                                type="submit"
                                variant="contained"
                                disabled={
                                    props.canSubmit != null
                                        ? !props.canSubmit
                                        : false
                                }
                            >
                                Finalizar compra
                            </Button>
                        </>
                    </CardActions>
                </form>
                <Divider />
                {/* <Box sx={{ margin: "1em" }}>{children}</Box> */}
            </Card>
        </>
    );
}

export default SubscriptionForm;
