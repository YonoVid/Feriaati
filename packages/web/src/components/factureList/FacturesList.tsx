import { useState } from "react";

import {
    Box,
    Card,
    Divider,
    IconButton,
    Pagination,
    Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventBusyIcon from "@mui/icons-material/EventBusy";

import { RFacturesListProps } from "@feria-a-ti/common/model/props/facturesListProps";
import { FactureData } from "@feria-a-ti/common/model/functionsTypes";

import FactureView from "./FactureView";
import "./FacturesList.css";
import FactureButton from "./FactureButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

function FacturesList(props: RFacturesListProps) {
    const { userId, factures, loadSize, color, children, loadData } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const pageSize = loadSize || 3;

    // Stored variables
    const [filterStart, setFilterStart] = useState<Date>();
    const [filterEnd, setFilterEnd] = useState<Date>();

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
        let list = factures.concat([]);
        if (filterStart && filterStart != null && factures.length != 0) {
            list = list.filter(
                (value: FactureData) =>
                    value.date.seconds >= filterStart.getTime() / 1000
            );
        }
        if (filterEnd && filterEnd != null && factures.length != 0) {
            list = list.filter(
                (value: FactureData) =>
                    value.date.seconds <= filterEnd.getTime() / 1000
            );
        }
        return list.sort((a, b) => b.date.seconds - a.date.seconds) || [];
    };

    return (
        <Card
            className="inputContainer"
            color={colorTheme}
            sx={{
                maxWidth: "80%",
                height: "70vh",
                alignContent: "center",
                borderRadius: "10%",
                paddingTop: "2%",
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Fecha inicial"
                        value={filterStart ? dayjs(filterStart) : null}
                        onAccept={(value: Dayjs | null) =>
                            value != null && setFilterStart(value.toDate())
                        }
                    />
                    <DatePicker
                        label="Fecha final"
                        value={filterEnd ? dayjs(filterEnd) : null}
                        onAccept={(value: Dayjs | null) =>
                            value != null && setFilterEnd(value.toDate())
                        }
                    />
                </LocalizationProvider>
                {(filterStart || filterEnd) && (
                    <IconButton
                        sx={{ justifyContent: "flex-end" }}
                        color="error"
                        onClick={() => {
                            setFilterStart(undefined);
                            setFilterEnd(undefined);
                        }}
                    >
                        <EventBusyIcon />
                    </IconButton>
                )}
            </Box>
            <Divider />
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
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
                    <Box
                        sx={{
                            margin: "1em",
                            flex: 3,
                            width: "100%",
                            height: "80%",
                        }}
                    >
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
