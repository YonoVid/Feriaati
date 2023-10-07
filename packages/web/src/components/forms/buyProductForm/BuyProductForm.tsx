import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    ButtonBase,
    Card,
    CardActions,
    Divider,
    IconButton,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { RBuyProductFormProps } from "@feria-a-ti/common/model/props/buyProductFormProps";
import { AccountDirection } from "@feria-a-ti/common/model/account/editAccountFields";
import { numberRegex } from "@feria-a-ti/common/check/checkBase";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import { BuyProductFormFields } from "@feria-a-ti/common/model/fields/buyingFields";
import "./BuyProductForm.css";

function BuyProductForm(props: RBuyProductFormProps) {
    const { account, onSubmit } = props;
    const { watch, handleSubmit, setValue, control } =
        useForm<BuyProductFormFields>();

    const [userDirection, setUserDirection] =
        useState<Array<AccountDirection>>();

    const [addNewDirection, setAddNewDirection] = useState<boolean>(false);

    const addDirectionField = () => {
        const newValue: AccountDirection = {
            street: "",
            streetNumber: NaN,
            region: NaN,
            commune: NaN,
        };
        setValue("direction", newValue);
        setAddNewDirection(true);
    };

    const setDirection = (newDirection: AccountDirection) => {
        setValue("direction", newDirection);
    };

    const removeDirectionField = () => {
        setAddNewDirection(false);
    };

    useEffect(() => {
        if (account && account !== null) {
            if (account.direction) {
                setUserDirection(account.direction);
            }
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
                <h1 style={{ maxWidth: "80%", textAlign: "center" }}>
                    Información de venta
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                            Añadir dirección
                        </Button>
                    </CardActions>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            boxShadow: 1,
                        }}
                    >
                        {userDirection?.map((value, index) => (
                            <Box sx={{ flex: 5 }} key={index}>
                                <ButtonBase onClick={() => setDirection(value)}>
                                    <Box>
                                        <Typography>
                                            Región{" "}
                                            {regionCode[value.region - 1][1]}
                                        </Typography>
                                        <Typography>
                                            Comuna{" "}
                                            {
                                                regionCommune[
                                                    value.region
                                                ].find(
                                                    (
                                                        commune: [
                                                            number,
                                                            string
                                                        ]
                                                    ) =>
                                                        (commune[0] as number) ==
                                                        value.commune
                                                )[1]
                                            }
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{value.street}</Typography>
                                        <Typography>
                                            #{value.streetNumber}
                                        </Typography>
                                    </Box>
                                </ButtonBase>
                            </Box>
                        ))}

                        {addNewDirection && (
                            <>
                                <Box sx={{ flex: 5 }}>
                                    <Box>
                                        <InputComponentAlt
                                            key={`direction.region`}
                                            control={control}
                                            name={`direction.region`}
                                            label="Región"
                                            type="select"
                                            selectOptions={regionCode}
                                            defaultValue="Elige tú región"
                                            onChange={() =>
                                                setValue(
                                                    `direction.commune`,
                                                    NaN
                                                )
                                            }
                                            rules={{
                                                required:
                                                    "La región es requerida",
                                            }}
                                        />
                                        <InputComponentAlt
                                            key={`direction.commune`}
                                            control={control}
                                            name={`direction.commune`}
                                            label="Comuna"
                                            type="select"
                                            selectOptions={
                                                regionCommune[
                                                    watch(`direction.region`)
                                                ]
                                            }
                                            defaultValue="Elige tú comuna"
                                            rules={{
                                                required:
                                                    "La comuna es requerida",
                                            }}
                                        />
                                    </Box>
                                    <Box>
                                        <InputComponentAlt
                                            key={`direction.street`}
                                            control={control}
                                            name={`direction.street`}
                                            label="Calle"
                                            type="text"
                                            rules={{
                                                required:
                                                    "La calle es requerida",
                                                maxLength: {
                                                    value: 128,
                                                    message:
                                                        "El máximo de caracteres es 128",
                                                },
                                            }}
                                        />
                                        <InputComponentAlt
                                            sx={{ maxWidth: "8em" }}
                                            key={`direction.streetNumber`}
                                            control={control}
                                            name={`direction.streetNumber`}
                                            label="Número de calle"
                                            type="text"
                                            rules={{
                                                required:
                                                    "El número de calle es requerido",
                                                maxLength: {
                                                    value: 128,
                                                    message:
                                                        "El máximo de caracteres es 128",
                                                },
                                                pattern: {
                                                    value: numberRegex,
                                                    message:
                                                        "Valor debe ser numérico",
                                                },
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <IconButton
                                        sx={{
                                            borderRadius: "20em",
                                            marginLeft: "auto",
                                            marginRight: "auto",
                                        }}
                                        color="error"
                                        disabled={
                                            props.canSubmit != null
                                                ? !props.canSubmit
                                                : false
                                        }
                                        onClick={() => removeDirectionField()}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                </Box>
                            </>
                        )}
                    </Box>
                    <CardActions>
                        <Button
                            sx={{
                                borderRadius: "20em",
                                marginLeft: "auto",
                                marginRight: "auto",
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
                            Actualizar cuenta de vendedor
                        </Button>
                    </CardActions>
                </form>
                <Divider />
                {/* <Box sx={{ margin: "1em" }}>{children}</Box> */}
            </Card>
        </>
    );
}

export default BuyProductForm;
