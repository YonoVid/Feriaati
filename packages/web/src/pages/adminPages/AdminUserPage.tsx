import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import { Card } from "@mui/material";

import { UserData } from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullUserFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import UserList from "@feria-a-ti/web/src/components/userList/UserList";
import AdminUserUpdateForm from "@feria-a-ti/web/src/components/forms/adminUserUpdateForm/AdminUserUpdateForm";

import {
    deleteBuyer,
    editBuyer,
    getBuyerList,
} from "@feria-a-ti/common/functions/admin/adminBuyerFunctions";

const AdminUserPage = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    //Selected product list data
    const [selectedUser, setSelectedUser] = useState<UserData | undefined>(
        undefined
    );
    // Data of vendors stored
    const [users, setUsers] = useState<UserData[]>([]);

    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    useEffect(() => {
        if (users.length == 0) {
            getUsers();
        }
    }, []);

    const getUsers = async () => {
        const formatedData: string = authToken as string;

        getBuyerList(
            { formatedData, setCanSubmit, setMessage },
            (value: UserData[]) => {
                setUsers(value);
            }
        );
    };

    const updateSubmit = async (data: FieldValues) => {
        const formatedData: UpdateFullUserFields = {
            adminToken: authToken || "",
            id: selectedUser?.id as string,
            email: data.email || selectedUser?.email,
            password: data.password || selectedUser?.password,
            username: data.username || selectedUser?.username,
        };

        editBuyer({ formatedData, setCanSubmit, setMessage }, () => {
            setSelectedUser(undefined);
            getUsers();
        });
    };

    const deleteSubmit = async (id: string) => {
        const formatedData: DeleteFields = {
            email: emailUser as string,
            token: authToken as string,
            itemId: id,
        };

        deleteBuyer({ formatedData, setCanSubmit, setMessage }, () => {
            setUsers(users.filter((value) => value.id !== id));
        });
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            {selectedUser ? (
                <AdminUserUpdateForm
                    canSubmit={canSubmit}
                    user={selectedUser}
                    onCancel={() => setSelectedUser(undefined)}
                    onSubmit={updateSubmit}
                />
            ) : (
                <Card
                    className="inputContainer"
                    color="secondary"
                    sx={{
                        maxWidth: "80%",
                        alignContent: "center",
                        borderRadius: "10%",
                    }}
                >
                    <h1 style={{ maxWidth: "100%" }}>{"Lista de Usuarios"}</h1>
                    <UserList
                        users={users}
                        onEdit={(data) => setSelectedUser(data)}
                        onDelete={(id: string) => deleteSubmit(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminUserPage;
