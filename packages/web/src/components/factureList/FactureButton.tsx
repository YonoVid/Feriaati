import { Box, Button, Chip, Typography } from "@mui/material";

import {
    FactureData,
    FactureStatus,
} from "@feria-a-ti/common/model/functionsTypes";

import "./FacturesList.css";

export type FactureButtonProps = {
    facture: FactureData;
    onClick: () => void;
    isSimple?: boolean;
    // sx?: SxProps<Theme>;
};

function FactureButton(props: FactureButtonProps) {
    const { facture, onClick, isSimple } = props;

    const renderStatus = (status: FactureStatus) => {
        switch (status) {
            case FactureStatus.APPROVED:
                return <Chip label="Completado" color="success" />;
            case FactureStatus.CANCELED:
                return <Chip label="Cancelado" color="warning" />;
            case FactureStatus.PROCESSING:
                return <Chip label="Procesando" color="info" />;
            case FactureStatus.NEGATED:
                return <Chip label="Negado" color="warning" />;
            default:
                break;
        }
    };

    return (
        <Button
            color="info"
            type="button"
            variant="outlined"
            onClick={onClick}
            sx={{ height: "20%" }}
        >
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: isSimple ? "column" : "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    margin: 0,
                    padding: 0,
                }}
            >
                {!isSimple && renderStatus(facture.status)}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        margin: 0,
                        padding: 0,
                    }}
                >
                    <Typography component="div" variant="body1">
                        {new Date(facture.date.seconds * 1000).toLocaleString()}
                    </Typography>
                    <Typography component="div" variant="subtitle2">
                        {facture.id}
                    </Typography>
                </Box>
                {(isSimple === undefined || isSimple) &&
                    renderStatus(facture.status)}
            </Box>
        </Button>
    );
}

export default FactureButton;
