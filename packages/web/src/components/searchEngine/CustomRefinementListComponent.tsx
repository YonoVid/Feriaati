import { indexName, IndexType } from "@feria-a-ti/common/model/indexTypes";
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

import { useClearRefinements, useRefinementList } from "react-instantsearch";
// …

function CustomRefinementListComponent(props: any) {
    const { items, refine } = useRefinementList(props);
    const { refine: refineClear, canRefine: canRefineClear } =
        useClearRefinements({ includedAttributes: [props.attribute] });

    return (
        <>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">
                    Categoría
                </FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={-1}
                    name="radio-buttons-group"
                >
                    <FormControlLabel
                        value={-1}
                        control={<Radio />}
                        label="Todos"
                        onChange={() => canRefineClear && refineClear()}
                    />
                    {items.map((item) => (
                        <FormControlLabel
                            key={item.value}
                            value={item.value}
                            control={<Radio />}
                            label={
                                (Object.keys(IndexType).includes(item.value) &&
                                !isNaN(+item.value)
                                    ? indexName[+item.value as IndexType]
                                    : item.value) +
                                " (" +
                                item.count +
                                ")"
                            }
                            onChange={() => {
                                canRefineClear && refineClear();
                                refine(item.value);
                            }}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </>
    );
}

export default CustomRefinementListComponent;
