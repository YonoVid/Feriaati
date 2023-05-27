import { themeOptions } from "@feria-a-ti/common/theme/base";
import { SessionUserData } from "@feria-a-ti/common/model/sessionType";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import ErrorPage from "./pages/errorPage/ErrorPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import LoginPage from "./pages/loginPage/LoginPage";
import RecoveryPage from "./pages/loginPage/RecoveryPage";
import UpdatePassPage from "./pages/loginPage/UpdatePassPage";
import Home from "./pages/Home";
import SessionPage from "./pages/SessionPage";
import RegisterVendorPage from "./pages/registerVendorPage/RegisterVendorPage";
import AdminLoginPage from "./pages/adminPage/AdminLoginPage";
import VendorLoginPage from "./pages/vendorLoginPage/VendorLoginPage";
import VendorRecoveryPage from "./pages/vendorLoginPage/VendorRecoveryPage";
import VendorUpdatePassPage from "./pages/vendorLoginPage/VendorUpdatePassPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/recovery",
        element: <RecoveryPage />,
    },
    {
        path: "/updatePass",
        element: <UpdatePassPage />,
    },
    {
        path: "/session",
        element: <SessionPage />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/loginVendor",
        element: <VendorLoginPage />,
    },
    {
        path: "/recoveryVendor",
        element: <VendorRecoveryPage />,
    },
    {
        path: "/updatePassVendor",
        element: <VendorUpdatePassPage />,
    },
    {
        path: "/registerVendor",
        element: <RegisterVendorPage />,
    },
    {
        path: "/admin",
        element: <AdminLoginPage />,
    },
]);

const theme = createTheme(themeOptions);
export const UserContext = React.createContext<SessionUserData>({
    type: undefined,
});

function App() {
    const [user, setUser] = useState("");
    const [type, setType] = useState<
        "admin" | "buyer" | "vendor" | undefined
    >();

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <UserContext.Provider
                    value={{
                        auth: user,
                        setAuth: setUser,
                        type: type,
                        setType: setType,
                    }}
                >
                    <NavBar />
                    <div id="main">
                        <RouterProvider router={router} />
                    </div>
                </UserContext.Provider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

export default App;
