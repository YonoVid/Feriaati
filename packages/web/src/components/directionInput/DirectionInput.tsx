import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Box,
    Button,
    IconButton,
    InputBaseComponentProps,
    SxProps,
    Theme,
} from "@mui/material";

import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { AccountDirection } from "@feria-a-ti/common/model/account/editAccountFields";

import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { numberRegex, stringRegex } from "@feria-a-ti/common/check/checkBase";

import InputComponentAlt from "@feria-a-ti/web/src/components/inputComponent/InputComponentAlt";
import DirectionAutocompleteInput from "./DirectionAutocompleteInput";
import { getCommune } from "@feria-a-ti/common/helpers";

export type DirectionInputProps = {
    sx?: SxProps<Theme>;
    inputProps?: InputBaseComponentProps | undefined;
    disabled?: boolean;
    hidden?: boolean;
    canCancel: boolean;
    onCancel: () => void;
    onChange: (value: AccountDirection) => void;
};

const DirectionInput = ({
    sx,
    inputProps,
    disabled,
    hidden,
    canCancel,
    onCancel,
    onChange,
}: DirectionInputProps) => {
    const {
        watch,
        setValue,
        resetField,
        getValues,
        reset,
        formState,
        control,
    } = useForm<AccountDirection>();

    const [manual, setManual] = useState<boolean>(false);

    const updateValues = (checkValid = true) => {
        if (!checkValid || (formState.isValid && !formState.isValidating)) {
            onChange(getValues());
        }
    };

    return (
        <>
            {!manual ? (
                <>
                    <DirectionAutocompleteInput
                        sx={{ width: "100%" }}
                        onSelect={(value) => {
                            console.log(value);
                            setValue(
                                "street",
                                value.structured_formatting.main_text
                            );
                            const { region, commune } = getCommune(
                                value.structured_formatting.secondary_text.split(
                                    ","
                                )[0]
                            );
                            console.log(
                                value.structured_formatting.secondary_text.split(
                                    ","
                                )[0]
                            );
                            if (region != -1 && commune != -1) {
                                setValue("region", region);
                                setValue("commune", commune);
                            }
                            setManual(true);
                        }}
                    />
                    <Button
                        onClick={() => {
                            setManual(true);
                        }}
                    >
                        Ingreso manual
                    </Button>
                </>
            ) : (
                <Box
                    sx={{
                        ...sx,
                        display: hidden ? "none" : "flex",
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        flexDirection: "column",
                    }}
                >
                    <Box>
                        <InputComponentAlt
                            sx={inputProps}
                            disabled={disabled}
                            control={control}
                            name="region"
                            label="Región"
                            type="select"
                            selectOptions={regionCode}
                            defaultValue="Elige tú región"
                            rules={{
                                required: "La región es requerida",
                                onChange: () => {
                                    resetField("commune");
                                },
                            }}
                        />
                        <InputComponentAlt
                            sx={inputProps}
                            control={control}
                            name="commune"
                            label="Comuna"
                            type="select"
                            selectOptions={regionCommune[watch("region")]}
                            defaultValue="Elige tú comuna"
                            rules={{
                                required: "La comuna es requerida",
                                onChange: () => updateValues(false),
                            }}
                        />
                    </Box>
                    <Box>
                        <InputComponentAlt
                            sx={inputProps}
                            disabled={disabled}
                            control={control}
                            name="street"
                            label="Calle"
                            type="text"
                            rules={{
                                required: "La calle es requerida",
                                onChange: () => updateValues(),
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: stringRegex,
                                    message:
                                        "No se aceptan caracteres especiales (Ej: <,>,+,-,etc.)",
                                },
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            paddingLeft: "5%",
                            paddingRight: "5%",
                        }}
                    >
                        <InputComponentAlt
                            sx={{ ...inputProps, flex: 1 }}
                            disabled={disabled}
                            control={control}
                            name="streetNumber"
                            label="Número de calle"
                            type="text"
                            rules={{
                                required: "El número de calle es requerido",
                                onChange: () => updateValues(),
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: numberRegex,
                                    message: "Valor debe ser numérico",
                                },
                            }}
                        />
                        <InputComponentAlt
                            sx={{ ...inputProps, flex: 1 }}
                            disabled={disabled}
                            control={control}
                            name="optionalNumber"
                            label="Número de casa o departamento"
                            type="text"
                            rules={{
                                onChange: () => updateValues(),
                                maxLength: {
                                    value: 128,
                                    message: "El máximo de caracteres es 128",
                                },
                                pattern: {
                                    value: numberRegex,
                                    message: "Valor debe ser numérico",
                                },
                            }}
                        />
                    </Box>
                    {canCancel && (
                        <IconButton
                            sx={{
                                width: "100%",
                                flex: 1,
                                borderRadius: "20em",
                                marginLeft: "auto",
                                marginRight: "auto",
                            }}
                            color="error"
                            disabled={!canCancel}
                            onClick={() => {
                                reset();
                                setManual(false);
                                onCancel();
                            }}
                        >
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                    )}
                </Box>
            )}
        </>
    );
};

export default DirectionInput;
