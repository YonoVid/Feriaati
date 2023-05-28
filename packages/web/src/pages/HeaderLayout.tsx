import { Outlet } from "react-router-dom";
import { Grid } from "@mui/material";
import NavBar from "@feria-a-ti/web/src/components/navBar/NavBar";

export const HeaderLayout = () => (
    <>
        <header>
            <NavBar />
        </header>
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: "90vh" }}
        >
            <Grid
                item
                xs={12}
                sx={{ minWidth: "100%", flex: "1", padding: "1em" }}
            >
                <Outlet />
            </Grid>
        </Grid>
    </>
);
