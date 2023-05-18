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

const router = createBrowserRouter([
    {
        path: "/",
        element: <RegisterPage />,
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
        element: <RegisterVendorPage />,
    },
    {
        path: "/vendor",
        element: <RegisterVendorPage />,
    },
]);

const theme = createTheme(themeOptions);
export const UserContext = React.createContext<SessionUserData>({});

function App() {
    const [user, setUser] = useState("");

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <UserContext.Provider value={{ auth: user, setAuth: setUser }}>
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
