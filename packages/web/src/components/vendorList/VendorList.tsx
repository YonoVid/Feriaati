import { useState } from "react";
import { Box, Card, Divider, Pagination, Stack } from "@mui/material";

import { ListVendorProps } from "@feria-a-ti/common/model/vendors/listVendorProps";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderLayout";

import { VendorView } from "./VendorView";
import "./VendorList.css";

function VendorList(props: ListVendorProps) {
    //Global UI context
    const { setMessage } = useHeaderContext();

    const { label, color, children, vendors, onEdit, onDelete } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
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
            <Stack
                direction={"column"}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {vendors &&
                    vendors
                        .slice((page - 1) * 3, page * 3)
                        .map((data, index) => (
                            <VendorView
                                sx={{ width: "100%" }}
                                key={index}
                                vendor={data}
                                onEdit={() => onEdit(data)}
                                onDelete={() => onDelete(data.id)}
                            />
                        ))}
            </Stack>
            <Divider />
            <Pagination
                count={vendors ? Math.floor(vendors.length / 3) + 1 : 1}
                page={page}
                onChange={handleChange}
                sx={{
                    maxWidth: "100%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            />
            <Box sx={{ margin: "1em" }}>{children}</Box>
        </Card>
    );
}

export default VendorList;
