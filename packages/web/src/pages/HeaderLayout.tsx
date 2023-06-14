import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { AlertColor, Grid } from "@mui/material";
import { Alert, Snackbar } from "@mui/material";

import NavBar from "@feria-a-ti/web/src/components/navBar/NavBar";

export type HeaderLayoutContext = {
  setMessage: (data: { msg: string; isError: boolean }) => void;
};

export const HeaderLayout = () => {
  const [open, setOpen] = useState(false);
  const [snackBarData, setSnackBarData] = useState("");
  const [snackBarType, setSnackBarType] = useState<AlertColor>("success");

  // // Alert Related values
  // const [showAlert, setShowAlert] = useState(false);
  // const [alertMessage, setAlertMessage] = useState("TEXT");

  const setMessage = (data: { msg: string; isError: boolean }) => {
    setSnackBarData(data.msg);
    setSnackBarType(data.isError ? "error" : "success");
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
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
        <Grid item xs={12} sx={{ minWidth: "100%", flex: "1", padding: "1em" }}>
          <Outlet context={{ setMessage }} />
        </Grid>
      </Grid>
      {/* <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            /> */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snackBarType || undefined}
          sx={{ width: "100%" }}
        >
          {snackBarData}
        </Alert>
      </Snackbar>
    </>
  );
};

export const useHeaderContext = () => useOutletContext<HeaderLayoutContext>();
