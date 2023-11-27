import {
    Box,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

import { VendorData } from "@feria-a-ti/common/model/functionsTypes";

import "./VendorList.css";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";

export type VendorRegisterViewProps = {
    vendor: VendorData;
    sx?: SxProps<Theme>;
    canSubmit?: boolean;
    onAccept?: () => void;
    onDelete?: () => void;
};

export const VendorRegisterView = (props: VendorRegisterViewProps) => {
    const { sx, vendor, canSubmit, onAccept, onDelete } = props;
    const {
        rut,
        enterpriseName,
        localNumber,
        region,
        commune,
        street,
        streetNumber,
        image,
        name,
        surname,
    } = vendor;

    return (
        <>
            <Box sx={{ ...sx, display: "flex", flex: 1 }}>
                <Card sx={{ display: "flex", flex: 1 }}>
                    <CardMedia
                        component="img"
                        sx={{ width: "15em", flex: 2 }}
                        image={image.replace(
                            "storage.googleapis.com",
                            "localhost:9199"
                        )}
                        alt={"Item image"}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flex: 4,
                            flexDirection: "column",
                        }}
                    >
                        <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography component="div" variant="h5">
                                {enterpriseName + " #" + localNumber}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Zona de atención:&nbsp;
                                {(region ? regionCode[region - 1][1] : "") +
                                    ", " +
                                    (region && commune
                                        ? regionCommune[region].find(
                                              (el: string | number[]) =>
                                                  el[0] === commune
                                          )[1]
                                        : "")}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                component="div"
                            >
                                Dirección:&nbsp;
                                {street + " " + streetNumber}
                            </Typography>
                            <h5>
                                Solicitante:&nbsp;
                                {name + " " + surname + "\n" + rut}
                            </h5>
                        </CardContent>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            float: "ltr",
                            pl: 1,
                            pb: 1,
                        }}
                    >
                        <IconButton
                            sx={{ size: "3em" }}
                            aria-label="previous"
                            color="secondary"
                            onClick={() => canSubmit && onAccept && onAccept()}
                        >
                            <CheckCircleIcon sx={{ fontSize: "2em" }} />
                        </IconButton>
                        <IconButton
                            sx={{ size: "3em" }}
                            aria-label="next"
                            color="primary"
                            onClick={() => canSubmit && onDelete && onDelete()}
                        >
                            <DisabledByDefaultIcon sx={{ fontSize: "2em" }} />
                        </IconButton>
                    </Box>
                </Card>
            </Box>
        </>
    );
};

export default VendorRegisterView;
