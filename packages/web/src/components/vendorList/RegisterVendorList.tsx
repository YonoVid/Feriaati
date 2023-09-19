import { useState } from "react";
import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";

import {
    userStatus,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderLayout";
import VendorRegisterView from "./VendorRegisterView";

interface RegisterVendorListProps {
    vendors: VendorData[];
    updateState: (id: string, status: userStatus) => void;
}

function RegisterVendorList(props: RegisterVendorListProps) {
    const { vendors, updateState } = props;

    return (
        <List>
            {vendors.map((vendor) => (
                <ListItem disablePadding key={vendor.id}>
                    <VendorRegisterView
                        sx={{ flex: 1, flexGrow: 1 }}
                        vendor={vendor}
                        onAccept={() =>
                            updateState(vendor.id, userStatus.activated)
                        }
                        onDelete={() =>
                            updateState(vendor.id, userStatus.blocked)
                        }
                    />
                    <Divider />
                </ListItem>
            ))}
        </List>
    );
}

export default RegisterVendorList;
