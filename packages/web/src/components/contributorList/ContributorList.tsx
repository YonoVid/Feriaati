import { useState } from "react";
import { Box, Button, Card, Divider, Pagination, Stack } from "@mui/material";

import { ListContributorProps } from "@feria-a-ti/common/model/contributors/listContributorProps";

import ContributorView from "./ContributorView";
import "./ContributorList.css";

function ContributorList(props: ListContributorProps) {
    const { color, children, contributors, isAdding, onAdd, onEdit, onDelete } =
        props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const [page, setPage] = useState(1);
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        console.log(event);
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
            {!isAdding && (
                <Button onClick={() => onAdd()}>Añadir colaborador</Button>
            )}
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
                {contributors &&
                    contributors
                        .slice((page - 1) * 3, page * 3)
                        .map((data, index) => (
                            <ContributorView
                                sx={{ width: "100%" }}
                                key={index}
                                contributor={data}
                                onEdit={() => onEdit(data)}
                                onDelete={() => onDelete(data.id as string)}
                            />
                        ))}
            </Stack>
            <Divider />
            <Pagination
                count={
                    contributors ? Math.floor(contributors.length / 3) + 1 : 1
                }
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

export default ContributorList;
