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

import "./InputRadioComponent.css";

interface Props<T> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
    label?: string;
    disabled?: boolean;
    hidden?: boolean;
    isSelected?: boolean;
    children: any;
    onClick: () => void;
}

const InputRadioComponent = <T extends FieldValues>({
    sx,
    label,
    children,
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
                    onClick();
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
                    {children}
                </Box>
            </ButtonBase>
        </Box>
    );
};

export default InputRadioComponent;
