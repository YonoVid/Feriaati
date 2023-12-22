import { colors } from "@feria-a-ti/common/theme/base";
import { Box, Card, Grid } from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

function ContactPage() {
    return (
        <Card
            sx={{
                marginTop: "5vh",
                paddingLeft: "20%",
                paddingRight: "20%",
                paddingBottom: "2em",
            }}
        >
            <h1>Contacto</h1>
            <p>
                Para conseguir ayuda contacta con nosotros en cualquiera de
                nuestros canales oficiales.
            </p>
            <h2>Canales</h2>
            <a href="mailto: feriaati@gmail.cl">feriaati@gmail.cl</a>
            <br />
            <a href="tel: +56999999999">+56999999999</a>
            <h2>Redes sociales</h2>
            <Grid item sx={{ display: "flex", justifyContent: "center" }}>
                <Box component="a" href="https://facebook.com/" sx={iconStyle}>
                    <FacebookIcon />
                </Box>
                <Box component="a" href="https://twitter.com/" sx={iconStyle}>
                    <TwitterIcon />
                </Box>
                <Box component="a" href="https://youtube.com/" sx={iconStyle}>
                    <YouTubeIcon />
                </Box>
            </Grid>
        </Card>
    );
}

const iconStyle = {
    width: 48,
    height: 48,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light,
    mr: 1,
    "&:hover": {
        bgcolor: colors.secondary,
    },
};

export default ContactPage;
