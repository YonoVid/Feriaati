import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Typography,
} from "@mui/material";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { IndexType } from "@feria-a-ti/common/model/indexTypes";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

import { colors } from "@feria-a-ti/common/theme/base";

export type TrendingResultProps = {
    item: any;
    canSubmit: boolean;
    onSubmit: (value: string, type: IndexType) => void;
};

function TrendingResultComponent(props: TrendingResultProps) {
    const { item, canSubmit, onSubmit } = props;

    console.log("ITEM::", item);

    const color = item.rate > 0.1 ? colors.primary : colors.secondary;

    const colorShadow = item.rate > 0.1 ? colors.light : colors.light;

    return (
        <Card
            sx={{
                display: "flex",
                maxWidth: "90%",
                minWidth: "16em",
                minHeight: "2em",
                flexDirection: { xs: "column", md: "row" },
                alignContent: "center",
                alignItems: "center",
                borderStyle: "solid",
                borderColor: colorShadow,
            }}
        >
            <CardMedia
                component="img"
                sx={{ objectFit: "cover", width: "15em", height: "15em" }}
                image={item.image.replace(
                    "storage.googleapis.com",
                    "localhost:9199"
                )}
                alt="Product image"
            />
            <Box sx={{ flex: 5, flexDirection: "column" }}>
                <CardContent>
                    <Typography paragraph fontWeight={"bold"}>
                        {item.name}
                    </Typography>
                    <Typography paragraph>{item.description}</Typography>
                </CardContent>
            </Box>
            {item.price != null && item.price != undefined && (
                <Box sx={{ flex: 1, flexDirection: "column" }}>
                    <Typography paragraph fontWeight={"bold"}>
                        ${numberWithCommas(item.price)}
                    </Typography>
                </Box>
            )}
            <Box sx={{ flex: 1, flexDirection: "column" }}>
                <IconButton
                    sx={{ alignContent: "end" }}
                    disabled={!canSubmit}
                    onClick={() => {
                        const mainId =
                            item.type == IndexType.PRODUCT
                                ? item.vendorId
                                : item.id;
                        onSubmit(mainId, item.type);
                    }}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Box>
        </Card>
    );
}

export default TrendingResultComponent;
