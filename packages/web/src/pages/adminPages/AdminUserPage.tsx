import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { Card } from "@mui/material";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ResponseData,
    UserData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DeleteFields,
    UpdateFullProductVendorFields,
    UpdateFullUserFields,
} from "@feria-a-ti/common/model/fields/adminFields";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import { checkProductVendorFullUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";
import UserList from "@feria-a-ti/web/src/components/userList/UserList";
import AdminUserUpdateForm from "@feria-a-ti/web/src/components/forms/adminUserUpdateForm/AdminUserUpdateForm";

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
        try {
            const users = httpsCallable<string, ResponseData<UserData[]>>(
                functions,
                "userList"
            );
            users(authToken).then((response) => {
                const usersData = response.data.extra as UserData[];
                setUsers(usersData);
                console.log("USERS DATA::", usersData);
            });
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    const updateselectedUser = async (data: FieldValues) => {
        try {
            const formatedData: UpdateFullUserFields = {
                adminToken: authToken || "",
                id: selectedUser?.id as string,
                email: data.email || selectedUser?.email,
                password: data.password || selectedUser?.password,
                username: data.username || selectedUser?.username,
            };
            const check = checkProductVendorFullUpdate(formatedData);
            console.log("PRODUCT VENDOR FULL UPDATE CHECK::", check);
            if (check) {
                setCanSubmit(false);
                const updateState = httpsCallable<
                    UpdateFullProductVendorFields,
                    ResponseData<null>
                >(functions, "updateselectedUser");

                updateState(formatedData)
                    .then((response) => {
                        const { msg, error } = response.data;
                        console.log(response.data);
                        setMessage({ msg, isError: error });
                        if (!error) {
                            setSelectedUser(undefined);
                            getUsers();
                        }
                    })
                    .finally(() => setCanSubmit(true));
            }
        } catch (error) {
            console.error("Error al actualizar el estado del local:", error);
        }
    };

    const deleteselectedUser = async (id: string) => {
        try {
            const updateState = httpsCallable<DeleteFields, ResponseData<null>>(
                functions,
                "deleteUser"
            );

            updateState({
                email: emailUser as string,
                token: authToken as string,
                itemId: id,
            }).then((response) => {
                const { msg, error } = response.data;
                console.log(response.data);
                setMessage({ msg, isError: error });
                if (!error) {
                    setUsers(users.filter((value) => value.id !== id));
                }
            });
            // .finally(() => setShowAlert(true));
        } catch (error) {
            console.error("Error al actualizar el estado del local:", error);
        }
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            {selectedUser ? (
                <AdminUserUpdateForm
                    canSubmit={canSubmit}
                    user={selectedUser}
                    onCancel={() => setSelectedUser(undefined)}
                    onSubmit={updateselectedUser}
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
                        onDelete={(id: string) => deleteselectedUser(id)}
                    />
                </Card>
            )}
        </>
    );
};

export default AdminUserPage;
