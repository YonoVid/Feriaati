import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardActions,
    Divider,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
    BuyProductFormFields,
    BuyTransportOptions,
} from "@feria-a-ti/common/model/fields/buyingFields";
import { RBuyProductFormProps } from "@feria-a-ti/common/model/props/buyProductFormProps";
import { AccountDirection } from "@feria-a-ti/common/model/account/editAccountFields";

import InputDirectionButton from "@feria-a-ti/web/src/components/inputDirectionButton/InputDirectionButton";
import DirectionInput from "../../directionInput/DirectionInput";
import "./BuyProductForm.css";

function BuyProductForm(props: RBuyProductFormProps) {
    const { account, canSubmit, onSubmit } = props;
    const { watch, handleSubmit, setValue, reset, clearErrors, control } =
        useForm<BuyProductFormFields>({
            defaultValues: { shipping: BuyTransportOptions.DELIVERY },
        });

    const [userDirection, setUserDirection] = useState<Array<AccountDirection>>(
        []
    );

    const [addNewDirection, setAddNewDirection] = useState<boolean>(false);
    const [selectedDirection, setSelectedDirection] =
        useState<AccountDirection>();

    const addDirectionField = () => {
        if (!addNewDirection) {
            reset();
            setAddNewDirection(true);
            setSelectedDirection(undefined);
        }
    };

    const setDirection = (newDirection: AccountDirection) => {
        setValue("direction.region", newDirection.region);
        setValue("direction.commune", newDirection.commune);
        setValue("direction.street", newDirection.street);
        setValue("direction.streetNumber", newDirection.streetNumber);
        setValue("direction.extra", newDirection.extra);
        clearErrors();
        setAddNewDirection(false);
    };

    const removeDirectionField = () => {
        setAddNewDirection(false);
        if (account && account !== null && account.direction) {
            setSelectedDirection(account.direction[0]);
        }
    };

    useEffect(() => {
        if (account && account !== null && account.direction) {
            setUserDirection(account.direction);
            setDirection(account.direction[0]);
            setSelectedDirection(account.direction[0]);
            setAddNewDirection(false);
        } else {
            setAddNewDirection(true);
        }
    }, [account, setValue]);

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
                    Finalización de venta
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                            Opción de recepción
                        </FormLabel>
                        <Controller
                            control={control}
                            name="shipping"
                            render={({ field: { onChange, value } }) => (
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="none"
                                    name="radio-buttons-group"
                                    value={
                                        value || BuyTransportOptions.DELIVERY
                                    }
                                    onChange={onChange}
                                >
                                    <FormControlLabel
                                        value={BuyTransportOptions.DELIVERY}
                                        control={<Radio />}
                                        label="Envío a casa"
                                        onClick={() => {
                                            setValue("direction", undefined);
                                        }}
                                    />
                                    <FormControlLabel
                                        value={BuyTransportOptions.RETIRE}
                                        control={<Radio />}
                                        label="Retiro en feria"
                                        onClick={() => {
                                            setValue("direction", undefined);
                                            if (
                                                account &&
                                                account !== null &&
                                                account.direction
                                            ) {
                                                removeDirectionField();
                                            } else {
                                                addDirectionField();
                                            }
                                        }}
                                    />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                    {watch("shipping") == BuyTransportOptions.DELIVERY && (
                        <>
                            {!addNewDirection && (
                                <CardActions>
                                    <Button
                                        sx={{
                                            borderRadius: "20em",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                        }}
                                        color="primary"
                                        variant="contained"
                                        disabled={
                                            props.canSubmit != null
                                                ? !props.canSubmit
                                                : false
                                        }
                                        onClick={() => addDirectionField()}
                                        startIcon={<AddIcon />}
                                    >
                                        Nueva dirección
                                    </Button>
                                </CardActions>
                            )}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    boxShadow: 1,
                                }}
                            >
                                <div
                                    style={{
                                        display: addNewDirection
                                            ? "flex"
                                            : "none",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flex: 5,
                                            flexDirection: "column",
                                        }}
                                    >
                                        <DirectionInput
                                            onChange={(value) => {
                                                console.log(
                                                    "DIRECTION INPUT CHANGE::"
                                                );
                                                if (value.region) {
                                                    setValue(
                                                        "direction.region",
                                                        value.region
                                                    );
                                                }
                                                if (value.commune) {
                                                    setValue(
                                                        "direction.commune",
                                                        value.commune
                                                    );
                                                }
                                                if (value.street) {
                                                    setValue(
                                                        "direction.street",
                                                        value.street
                                                    );
                                                }
                                                if (value.streetNumber) {
                                                    setValue(
                                                        "direction.streetNumber",
                                                        value.streetNumber
                                                    );
                                                }
                                            }}
                                            canCancel={
                                                userDirection.length > 0 &&
                                                (canSubmit != null
                                                    ? canSubmit
                                                    : true)
                                            }
                                            onCancel={() =>
                                                removeDirectionField()
                                            }
                                        />
                                    </Box>
                                </div>
                                <Box sx={{ flex: 1 }}></Box>

                                {userDirection?.map((value, index) => (
                                    <InputDirectionButton
                                        sx={{ flex: 1 }}
                                        name={"direction" + index}
                                        key={index}
                                        direction={value}
                                        isSelected={selectedDirection == value}
                                        onClick={(data) => {
                                            setDirection(data);
                                            setSelectedDirection(data);
                                        }}
                                    />
                                ))}
                            </Box>
                        </>
                    )}
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

export default BuyProductForm;
