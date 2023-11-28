import { useState } from "react";

import {
    Box,
    Card,
    Divider,
    IconButton,
    Pagination,
    Stack,
    TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { RFacturesListProps } from "@feria-a-ti/common/model/props/facturesListProps";
import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

import FactureView from "./FactureView";
import "./FacturesList.css";
import FactureButton from "./FactureButton";

function FacturesList(props: RFacturesListProps) {
    const { userId, factures, loadSize, color, children, loadData } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const pageSize = loadSize || 3;

    // Stored variables
    const [filter, setFilter] = useState<string | null>();
    const [selectedFacture, setSelectedFacture] = useState<FactureData>();

    const [page, setPage] = useState(1);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(event);
        if (value * pageSize > factures.length && loadData != undefined) {
            loadData(factures.length);
        }
        setPage(value);
    };

    const getList = (): FactureData[] => {
        if (filter && filter != null && filter != "" && factures.length != 0) {
            return factures.filter((value: any) =>
                value.name.toUpperCase().includes(filter.toUpperCase())
            );
        }
        return factures.sort((a, b) => b.date.seconds - a.date.seconds) || [];
    };

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "80%",
                maxHeight: "90vh",
                alignContent: "center",
                borderRadius: "10%",
                paddingTop: "5%",
                paddingBottom: "5%",
            }}
        >
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Pagination
                    count={Math.floor(factures.length / 3) + 1}
                    page={page}
                    onChange={handleChange}
                    sx={{
                        flex: 2,
                        maxWidth: "100%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                />
                <TextField
                    sx={{ flex: 1 }}
                    label="Filtro"
                    variant="outlined"
                    onChange={(event) => setFilter(event.target.value)}
                />
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                }}
            >
                <Stack
                    direction={"column"}
                    spacing={{ xs: 1, sm: 2, md: 4 }}
                    sx={{
                        flex: 1,
                        marginLeft: "auto",
                        marginRight: "auto",
                        justifyContent: "flex-start",
                        alignContent: "center",
                        display: {
                            md: "flex",
                            sm: selectedFacture ? "none" : "flex",
                            xs: selectedFacture ? "none" : "flex",
                        },
                    }}
                >
                    {getList()
                        .slice((page - 1) * pageSize, page * pageSize)
                        .map((facture, index) => (
                            <FactureButton
                                facture={facture}
                                onClick={() => setSelectedFacture(facture)}
                                isSimple={selectedFacture != undefined}
                                key={index + "facture"}
                            />
                        ))}
                </Stack>
                {selectedFacture && (
                    <Box sx={{ margin: "1em", flex: 3, width: "100%" }}>
                        <Box
                            sx={{
                                display: "flex",
                                width: "90%",
                                margin: "auto",
                            }}
                        >
                            <IconButton
                                sx={{ justifyContent: "flex-start" }}
                                onClick={() => setSelectedFacture(undefined)}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Box>
                        {selectedFacture != undefined &&
                        selectedFacture != null ? (
                            <FactureView
                                color={color || ""}
                                vendorId={userId}
                                facture={selectedFacture}
                            />
                        ) : (
                            <h2>No hay factura seleccionada</h2>
                        )}
                        {children}
                    </Box>
                )}
            </Box>
        </Card>
    );
}

export default FacturesList;
