import { useState } from "react";
import {
    communeCodeDictionary,
    regionCodeDictionary,
} from "@feria-a-ti/common/constants/form";
import { Box, FormLabel, MenuItem, TextField } from "@mui/material";
import {
    useMenu,
    UseMenuProps,
    useClearRefinements,
} from "react-instantsearch";

export function CustomMenuSelectComponent(
    props: UseMenuProps & { type: "region" | "commune" }
) {
    const { type } = props;

    const { items, refine } = useMenu(props);
    const { refine: clearRefine } = useClearRefinements({
        includedAttributes: [type],
    });

    const [value, setValue] = useState<string>("default");

    const label = "Selección de " + (type === "region" ? "región" : "comuna");
    const replaceDictionary =
        type === "region" ? regionCodeDictionary : communeCodeDictionary;

    const updateRefine = (newValue: string) => {
        setValue(newValue);

        if (newValue === "default") {
            clearRefine();
        } else {
            refine(newValue);
        }
    };

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
            <FormLabel id="rangeLabel">
                Selección de {type === "region" ? "región" : "comuna"}
            </FormLabel>
            <TextField
                sx={{ flex: 1, minWidth: "10em", maxWidth: "100%" }}
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                select={true}
                label={label}
                margin="dense"
                type={"text"}
                color="secondary"
                variant="filled"
                placeholder={"Todos"}
                defaultValue={"default"}
                onChange={(event) => {
                    updateRefine(event.target.value);
                }}
                value={value}
            >
                {items
                    .concat([
                        {
                            label: "Todos",
                            value: "default",
                            count: 0,
                            isRefined: false,
                        },
                    ])
                    .map((item) => (
                        <MenuItem key={item.label} value={item.value}>
                            {replaceDictionary[item.label as string] ||
                                item.label}
                            {item.count !== 0 && " (" + item.count + ")"}
                        </MenuItem>
                    ))}
            </TextField>
        </Box>
    );
}

export default CustomMenuSelectComponent;
