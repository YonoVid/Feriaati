import { useState } from "react";

import {
    Box,
    Button,
    Card,
    Divider,
    Pagination,
    Stack,
    TextField,
} from "@mui/material";
import { RFacturesListProps } from "@feria-a-ti/common/model/props/facturesListProps";
import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

import FactureView from "./FactureView";
import "./FacturesList.css";

function FacturesList(props: RFacturesListProps) {
    const { userId, label, factures, loadSize, color, children, loadData } =
        props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const pageSize = loadSize || 3;

    // Stored variables
    const [filter, setFilter] = useState<string | null>();
    const [selectedFacture, setSelectedFacture] = useState<FactureData>();

    const [page, setPage] = useState(1);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
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
        return factures || [];
    };

    return (
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
                {label != null ? label : "Iniciar Sesion"}
            </h1>
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
            <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {getList()
                    .slice((page - 1) * pageSize, page * pageSize)
                    .map((facture, index) => (
                        <Button
                            color="info"
                            type="button"
                            variant="outlined"
                            onClick={() => setSelectedFacture(facture)}
                            key={index + "facture"}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <h4>
                                    {new Date(
                                        facture.date.seconds * 1000
                                    ).toISOString()}
                                </h4>
                                <p>{facture.id}</p>
                            </Box>
                        </Button>
                    ))}
            </Stack>
            <Box sx={{ margin: "1em" }}>
                {selectedFacture != undefined && selectedFacture != null ? (
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
        </Card>
    );
}

export default FacturesList;
