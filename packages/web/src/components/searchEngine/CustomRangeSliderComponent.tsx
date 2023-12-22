import { Box, Button, FormLabel, Slider } from "@mui/material";
import { useEffect, useState } from "react";
import { useRange } from "react-instantsearch";
// …

function CustomRangeSliderComponent(props: any) {
    const { start, range, canRefine, refine } = useRange(props);
    const { min, max } = range;
    const [value, setValue] = useState<number[]>([
        min?.valueOf() || 0,
        max?.valueOf() || 0,
    ]);

    const numberStartMin = start[0]?.valueOf() || 0;
    const numberStartMax = start[1]?.valueOf() || 0;

    const numberMin = min?.valueOf() || 0;
    const numberMax = max?.valueOf() || 0;

    const from = Math.max(
        numberMin,
        Number.isFinite(numberStartMin) ? numberStartMin : numberMin
    );
    const to = Math.min(
        numberMax,
        Number.isFinite(numberStartMax) ? numberStartMax : numberMax
    );

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    useEffect(() => {
        setValue([from, to]);
    }, [from, to]);

    return (
        <Box
            sx={{
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "80%",
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <FormLabel id="rangeLabel">Rango de precio</FormLabel>
            <Slider
                disabled={!canRefine}
                defaultValue={50}
                valueLabelDisplay="auto"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                onChangeCommitted={() => {
                    if (canRefine) {
                        refine([value[0], value[1]]);
                    }
                }}
                disableSwap
            />
        </Box>
    );
}

export default CustomRangeSliderComponent;
