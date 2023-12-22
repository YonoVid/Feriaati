import { useState } from "react";
import { FieldValues, UseControllerProps } from "react-hook-form";

import {
    Box,
    ButtonBase,
    Radio,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";

import { AccountDirection } from "@feria-a-ti/common/model/functionsTypes";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

import { colors } from "@feria-a-ti/common/theme/base";

import "./InputDirectionButton.css";

interface Props<T> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
    label?: string;
    disabled?: boolean;
    hidden?: boolean;
    isSelected?: boolean;
    direction: AccountDirection;
    onClick: (data: AccountDirection) => void;
}

const InputDirectionButton = <T extends FieldValues>({
    sx,
    label,
    direction,
    disabled,
    isSelected,
    onClick,
}: Props<T>) => {
    return (
        <Box
            sx={{
                border: isSelected ? 3 : 0,
                borderRadius: "10em",
                borderColor: colors.primary,
                ...sx,
            }}
        >
            <ButtonBase
                sx={{ width: "100%", display: "flex", flexDirection: "row" }}
                onClick={() => {
                    onClick(direction);
                }}
                disabled={disabled}
            >
                <Radio
                    sx={{ flex: 1 }}
                    checked={isSelected}
                    disableRipple={true}
                />
                <Box
                    sx={{
                        flex: 5,
                        padding: "5",
                        m: "10",
                        flexDirection: "row",
                    }}
                >
                    <Typography>
                        {direction.street} #{direction.streetNumber}
                    </Typography>
                    <Typography>
                        {regionCode[direction.region - 1][1]}
                        {", "}
                        {
                            regionCommune[direction.region].find(
                                (commune: [number, string]) =>
                                    (commune[0] as number) == direction.commune
                            )[1]
                        }
                    </Typography>
                </Box>
            </ButtonBase>
        </Box>
    );
};

export default InputDirectionButton;
