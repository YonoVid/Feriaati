import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeOptions } from "@feria-a-ti/common/theme/base";
import { SessionUserData } from "@feria-a-ti/common/model/sessionType";
import ErrorPage from "@feria-a-ti/web/src/pages/errorPage/ErrorPage";
import RegisterPage from "@feria-a-ti/web/src/pages/registerPage/RegisterPage";
import LoginPage from "@feria-a-ti/web/src/pages/loginPage/LoginPage";
import RecoveryPage from "@feria-a-ti/web/src/pages/loginPage/RecoveryPage";
import UpdatePassPage from "@feria-a-ti/web/src/pages/loginPage/UpdatePassPage";
import Home from "@feria-a-ti/web/src/pages/Home";
import SessionPage from "@feria-a-ti/web/src/pages/SessionPage";
import RegisterVendorPage from "@feria-a-ti/web/src/pages/registerVendorPage/RegisterVendorPage";
import AdminLoginPage from "@feria-a-ti/web/src/pages/adminPage/AdminLoginPage";
import VendorLoginPage from "@feria-a-ti/web/src/pages/vendorLoginPage/VendorLoginPage";
import VendorRecoveryPage from "@feria-a-ti/web/src/pages/vendorLoginPage/VendorRecoveryPage";
import VendorUpdatePassPage from "@feria-a-ti/web/src/pages/vendorLoginPage/VendorUpdatePassPage";
import { HeaderLayout } from "@feria-a-ti/web/src/pages/HeaderLayout";
import ActivateVendors from "@feria-a-ti/web/src/pages/adminPage/ActivateVendors";
import { userType } from "@feria-a-ti/common/model/functionsTypes";

const router = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [
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
                path: "/adminLogin",
                element: <AdminLoginPage />,
            },
            {
                path: "/admin",
                element: <ActivateVendors />,
            },
        ],
    },
]);

const theme = createTheme(themeOptions);
export const UserContext = React.createContext<SessionUserData>({});

function App() {
    const [user, setUser] = useState(localStorage.getItem("email") || "");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [type, setType] = useState<userType>(
        (localStorage.getItem("type") as userType) || undefined
    );

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <UserContext.Provider
                    value={{
                        authUser: user,
                        setAuthUser: setUser,
                        authToken: token,
                        setAuthToken: setToken,
                        type: type,
                        setType: setType,
                    }}
                >
                    <div id="main">
                        <RouterProvider router={router} />
                    </div>
                </UserContext.Provider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

export default App;
