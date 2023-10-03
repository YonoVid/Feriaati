import { useEffect, useRef, useState } from "react";

import { useSearchBox } from "react-instantsearch";

import {
    Box,
    Button,
    Card,
    Divider,
    IconButton,
    Pagination,
    Stack,
    TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { RCustomSearchBoxComponentProps } from "@feria-a-ti/common/model/props/customSearchBoxProps";

import { colors } from "@feria-a-ti/common/theme/base";

import "./CustomSearchBoxComponent.css";

function CustomSearchBoxComponent(props: RCustomSearchBoxComponentProps) {
    const { label, color, children, filter } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const { query, refine, clear } = useSearchBox(props);

    const [inputValue, setInputValue] = useState(query);
    const [filterVendor, setFilterVendor] = useState<string | null>();

    const inputRef = useRef<HTMLInputElement>(null);

    const setQuery = (newQuery: string) => {
        setInputValue(newQuery);

        refine(newQuery);
    };

    return (
        <form
            action=""
            role="search"
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (inputRef.current) {
                    inputRef.current.blur();
                }
            }}
            onReset={(event) => {
                event.preventDefault();
                event.stopPropagation();

                setQuery("");

                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }}
        >
            <Card
                className="inputContainer"
                color={colorTheme}
                sx={{
                    maxWidth: "80%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1 style={{ maxWidth: "100%" }}>
                    {label != null ? label : "Buscar productos"}
                </h1>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <TextField
                            sx={{ flex: 1 }}
                            label="Filtro"
                            variant="outlined"
                            value={inputValue}
                            onChange={(event) =>
                                setQuery(event.currentTarget.value)
                            }
                        />
                        <IconButton
                            type="submit"
                            sx={{
                                backgroundColor: colors.primary,
                                color: colors.light,
                            }}
                        >
                            <SearchIcon />
                        </IconButton>
                        <IconButton
                            type="reset"
                            sx={{
                                backgroundColor: colors.secondary,
                                color: colors.light,
                            }}
                            color="secondary"
                        >
                            <RestartAltIcon />
                        </IconButton>
                    </Box>
                    <Pagination
                        count={Math.floor(1 / 3) + 1}
                        page={1}
                        onChange={() => 1}
                        sx={{
                            flex: 2,
                            maxWidth: "100%",
                            alignContent: "center",
                            borderRadius: "10%",
                        }}
                    />
                </Box>
                <Divider />
                <Box sx={{ margin: "1em" }}>{children}</Box>
            </Card>
        </form>
    );
}

export default CustomSearchBoxComponent;
