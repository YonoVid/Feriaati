import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { List, ListItem, ListItemText, Card, Divider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ResponseData,
    VendorCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";
import { UpdateStateFields } from "@feria-a-ti/common/model/adminFields";
import { userStatus } from "@feria-a-ti/common/model/registerFields";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import { UserContext } from "@feria-a-ti/web/src/App";

const AdminStatePage = () => {
    //Global state variable
    const { type } = useContext(UserContext);

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        setShowAlert(false);
    };

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorCollectionData[]>([]);
    useEffect(() => {
        getVendors();
    }, []);

    const getVendors = async () => {
        try {
            const vendors = httpsCallable(functions, "vendorList");
            const response = await vendors();
            const vendorsData = response.data as VendorCollectionData[];
            setVendors(vendorsData);
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };
    const updateState = async (id: string, status: userStatus) => {
        try {
            const updateState = httpsCallable<
                UpdateStateFields,
                ResponseData<null>
            >(functions, "vendorStateUpdate");
            updateState({ id, email: id, status })
                .then((response) => {
                    console.log(response.data);
                    setAlertMessage(response.data.msg);
                })
                .finally(() => setShowAlert(true));
        } catch (error) {
            console.error("Error al actualizar el estado del vendedor:", error);
        }
    };

    return (
        <>
            {type !== "admin" && <Navigate to="/adminLogin" replace={true} />}
            <Card
                className="inputContainer"
                color="secondary"
                sx={{
                    maxWidth: "50%",
                    alignContent: "center",
                    borderRadius: "10%",
                }}
            >
                <h1 style={{ maxWidth: "100%" }}>{"Lista de Vendedores"}</h1>
                <List>
                    {vendors.map((vendor) => (
                        <ListItem
                            disablePadding
                            key={vendor.email}
                            secondaryAction={
                                <>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            updateState(
                                                vendor.email,
                                                userStatus.activated
                                            )
                                        }
                                    >
                                        <CheckCircleIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() =>
                                            updateState(
                                                vendor.email,
                                                userStatus.blocked
                                            )
                                        }
                                    >
                                        <DisabledByDefaultIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemText primary={vendor.enterpriseName} />
                            <Divider />
                        </ListItem>
                    ))}
                </List>
            </Card>
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
};

export default AdminStatePage;
