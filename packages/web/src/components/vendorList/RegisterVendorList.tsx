import { Divider, List, ListItem } from "@mui/material";

import {
    userStatus,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";

import VendorRegisterView from "./VendorRegisterView";

interface RegisterVendorListProps {
    vendors: VendorData[];
    canSubmit: boolean;
    updateState: (id: string, status: userStatus) => void;
}

function RegisterVendorList(props: RegisterVendorListProps) {
    const { vendors, canSubmit, updateState } = props;

    return (
        <List>
            {vendors.map((vendor) => (
                <ListItem disablePadding key={vendor.id}>
                    <VendorRegisterView
                        sx={{ flex: 1, flexGrow: 1 }}
                        vendor={vendor}
                        canSubmit={canSubmit}
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
