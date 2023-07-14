import { useState } from "react";
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import {
    userStatus,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderLayout";

interface RegisterVendorListProps {
    vendors: VendorData[];
    updateState: (id: string, status: userStatus) => void;
}

function RegisterVendorList(props: RegisterVendorListProps) {
    const { vendors, updateState } = props;

    return (
        <List>
            {vendors.map((vendor) => (
                <ListItem
                    disablePadding
                    key={vendor.id}
                    secondaryAction={
                        <>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                    updateState(vendor.id, userStatus.activated)
                                }
                            >
                                <CheckCircleIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() =>
                                    updateState(vendor.id, userStatus.blocked)
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
    );
}

export default RegisterVendorList;
