import { FieldValues, UseControllerProps } from "react-hook-form";

import { Box, ButtonBase, Radio, SxProps, Theme } from "@mui/material";

import { colors } from "@feria-a-ti/common/theme/base";

import "./InputRadioComponent.css";
import { ReactNode } from "react";

interface Props<T extends FieldValues> extends UseControllerProps<T> {
    sx?: SxProps<Theme>;
    label?: string;
    disabled?: boolean;
    hidden?: boolean;
    isSelected?: boolean;
    children: ReactNode;
    onClick: () => void;
}

const InputRadioComponent = <T extends FieldValues>({
    sx,
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
