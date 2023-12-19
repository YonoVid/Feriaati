import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";

import {
    Box,
    Container,
    Grid,
    Link,
    TextField,
    Typography,
} from "@mui/material";

import { colors } from "@feria-a-ti/common/theme/base";
import { userType } from "@feria-a-ti/common/model/functionsTypes";

import { UserContext } from "@feria-a-ti/web/src/App";

function AppFooter() {
    //Context variables
    const { type } = useContext(UserContext);

    const navigate = useNavigate();

    const isVendorPage =
        window.location.pathname.includes("loginVendor") ||
        window.location.pathname.includes("registerVendor") ||
        type === userType.vendor ||
        type === userType.contributor;

    const reloadNavigate = (path: string) => {
        navigate(path);
        window.scrollTo(0, 0);
    };

    return (
        <Container
            sx={{
                width: "100%",
                my: 8,
                display: "flex",
                flexDirection: "column",
                backgroundColor: isVendorPage
                    ? colors.secondaryShadow
                    : colors.primary,
            }}
        >
            <Grid
                container
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                }}
                spacing={5}
            >
                <Grid
                    item
                    xs={6}
                    sm={4}
                    md={3}
                    sx={{ width: "100%", justifyContent: "center" }}
                >
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-end"
                        spacing={2}
                        sx={{
                            height: 120,
                        }}
                    >
                        <Grid
                            item
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
                            <Box
                                component="a"
                                href="https://facebook.com/"
                                sx={iconStyle}
                            >
                                <FacebookIcon />
                            </Box>
                            <Box
                                component="a"
                                href="https://twitter.com/"
                                sx={iconStyle}
                            >
                                <TwitterIcon />
                            </Box>
                            <Box
                                component="a"
                                href="https://youtube.com/"
                                sx={iconStyle}
                            >
                                <YouTubeIcon />
                            </Box>
                        </Grid>
                        <Grid item>
                            <Copyright />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                    <Typography variant="h5" gutterBottom>
                        Empresa
                    </Typography>
                    <Box component="ul" sx={{ m: 0, listStyle: "none", p: 0 }}>
                        <Box component="li" sx={{ py: 0.5 }}>
                            <Link
                                component="button"
                                onClick={() => reloadNavigate("/about")}
                                sx={{ color: colors.light }}
                            >
                                Sobre nosotros
                            </Link>
                        </Box>
                        <Box component="li" sx={{ py: 0.5 }}>
                            <Link
                                component="button"
                                onClick={() => reloadNavigate("/contact")}
                                sx={{ color: colors.light }}
                            >
                                Contacto
                            </Link>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={8} md={4}>
                    <Typography variant="h5" gutterBottom>
                        Languaje
                    </Typography>
                    <TextField
                        select
                        size="medium"
                        variant="standard"
                        SelectProps={{
                            native: true,
                        }}
                        sx={{
                            mt: 1,
                            width: 150,
                            backgroundColor: colors.light,
                        }}
                    >
                        {LANGUAGES.map((language) => (
                            <option value={language.code} key={language.code}>
                                {language.name}
                            </option>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Grid item sx={{ width: "100%" }}>
                <hr />
            </Grid>
            <Grid item sx={{ marginBottom: "1em" }}>
                <Typography variant="caption">
                    {"All coyright reserved to "}
                    <Link
                        component="button"
                        onClick={() => reloadNavigate("/adminLogin")}
                        sx={{ color: colors.light }}
                    >
                        Feria a ti company
                    </Link>
                </Typography>
            </Grid>
        </Container>
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
        bgcolor: colors.primary,
    },
};

function Copyright() {
    return (
        <React.Fragment>
            {"© "}
            <Link
                color="inherit"
                component="button"
                sx={{ color: colors.light }}
            >
                Feria a ti
            </Link>{" "}
            {new Date().getFullYear()}
        </React.Fragment>
    );
}

const LANGUAGES = [
    {
        code: "es-CL",
        name: "Español",
    },
];

export default AppFooter;
