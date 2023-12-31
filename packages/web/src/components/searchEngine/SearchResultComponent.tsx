import {
    Avatar,
    Box,
    Card,
    CardContent,
    IconButton,
    Typography,
} from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { SearchResultProps } from "@feria-a-ti/common/model/props/searchEngineProps";
import { IndexType } from "@feria-a-ti/common/model/indexTypes";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

import { colors } from "@feria-a-ti/common/theme/base";

import "./SearchResultComponent.css";

function SearchResultComponent(props: SearchResultProps) {
    const { index, canSubmit, onSubmit } = props;

    const color = index.rate > 0.1 ? colors.primary : colors.secondary;

    const colorShadow = index.rate > 0.1 ? colors.light : colors.light;

    return (
        <Card
            sx={{
                display: "flex",
                maxWidth: "90%",
                width: "90%",
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                borderColor: colorShadow,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flex: 1,
                    shadow: 1,
                    backgroundColor: color,
                    flexDirection: "column",
                    height: "100%",
                    width: "100%",
                }}
            >
                <Avatar
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                    }}
                    alt={index.name}
                    src={index.image}
                />
            </Box>
            <Box sx={{ flex: 5, flexDirection: "column" }}>
                <CardContent>
                    <Typography paragraph fontWeight={"bold"}>
                        {index.name}
                    </Typography>
                    <Typography paragraph>{index.description}</Typography>
                </CardContent>
            </Box>
            {index.price != null && index.price != undefined && (
                <Box sx={{ flex: 1, flexDirection: "column" }}>
                    <Typography paragraph fontWeight={"bold"}>
                        ${numberWithCommas(index.price)}
                    </Typography>
                </Box>
            )}
            <Box sx={{ flex: 1, flexDirection: "column" }}>
                <IconButton
                    sx={{ alignContent: "end" }}
                    disabled={!canSubmit}
                    onClick={() => {
                        const mainId =
                            index.type == IndexType.PRODUCT
                                ? index.vendorId
                                : index.id;
                        onSubmit(mainId, index.type);
                    }}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Box>
        </Card>
    );
}

export default SearchResultComponent;
