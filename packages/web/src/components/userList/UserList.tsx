import { useState } from "react";
import { Box, Card, Divider, Pagination, Stack } from "@mui/material";

import { ListUserProps } from "@feria-a-ti/common/model/users/listUserProps";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderLayout";

import { UserView } from "./UserView";
import "./UserList.css";

function UserList(props: ListUserProps) {
    //Global UI context
    const { setMessage } = useHeaderContext();

    const { label, color, children, users, onEdit, onDelete } = props;

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
                {users &&
                    users
                        .slice((page - 1) * 3, page * 3)
                        .map((data, index) => (
                            <UserView
                                sx={{ width: "100%" }}
                                key={index}
                                user={data}
                                onEdit={() => onEdit(data)}
                                onDelete={() => onDelete(data.id)}
                            />
                        ))}
            </Stack>
            <Divider />
            <Pagination
                count={users ? Math.floor(users.length / 3) + 1 : 1}
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

export default UserList;
