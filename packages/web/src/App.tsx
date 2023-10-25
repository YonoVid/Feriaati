import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { themeOptions } from "@feria-a-ti/common/theme/base";
import { RSessionUserData } from "@feria-a-ti/common/model/sessionType";
import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import ErrorPage from "@feria-a-ti/web/src/pages/errorPage/ErrorPage";
import RegisterPage from "@feria-a-ti/web/src/pages/userPages/RegisterPage";
import LoginPage from "@feria-a-ti/web/src/pages/userPages/LoginPage";
import RecoveryPage from "@feria-a-ti/web/src/pages/userPages/RecoveryPage";
import Home from "@feria-a-ti/web/src/pages/Home";
import SessionPage from "@feria-a-ti/web/src/pages/SessionPage";
import RegisterVendorPage from "@feria-a-ti/web/src/pages/vendorPages/RegisterVendorPage";
import AdminLoginPage from "./pages/adminPages/AdminLoginPage";
import ProductPage from "@feria-a-ti/web/src/pages/productPage/ProductPage";
import VendorLoginPage from "@feria-a-ti/web/src/pages/vendorPages/VendorLoginPage";
import VendorRecoveryPage from "@feria-a-ti/web/src/pages/vendorPages/VendorRecoveryPage";
import { HeaderLayout } from "@feria-a-ti/web/src/pages/HeaderLayout";
import AdminActivateVendors from "./pages/adminPages/AdminActivateVendors";
import ManagerVendorPage from "@feria-a-ti/web/src/pages/vendorPages/ManagerVendorPage";
import ProductAddManager from "./pages/vendorPages/ProductAddManager";
import UserVendorSelect from "./pages/userPages/UserVendorSelect";
import AccountPage from "./pages/accountPages/AccountPage";
import ShoppingCartPage from "./pages/userPages/ShoppingCartPage";
import FacturesPage from "./pages/userPages/FacturesPage";
import VendorFacturesPage from "./pages/vendorPages/VendorFacturesPage";
import AdminUserPage from "./pages/adminPages/AdminUserPage";
import AdminVendorPage from "./pages/adminPages/AdminVendorPage";
import AdminProductsPage from "./pages/adminPages/AdminProductsPage";
import SearchPage from "./pages/userPages/SearchPage";
import BuyProductsPage from "./pages/userPages/BuyProductsPage";
import FactureStatusPage from "./pages/userPages/FactureStatusPage";
import SubscriptionPage from "./pages/accountPages/SubscriptionPage";

const router = createBrowserRouter([
    {
        element: <HeaderLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
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
                path: "/session",
                element: <SessionPage />,
            },
            {
                path: "/subscription",
                element: <SubscriptionPage />,
            },
            {
                path: "/product",
                element: <ProductPage />,
            },
            {
                path: "/transaction/:type",
                element: <FactureStatusPage />,
            },
            {
                path: "/factures",
                element: <FacturesPage />,
            },
            {
                path: "/factures",
                element: <FacturesPage />,
            },
            {
                path: "/shoppingCart",
                element: <ShoppingCartPage />,
            },
            {
                path: "/buyProducts",
                element: <BuyProductsPage />,
            },
            {
                path: "/search",
                element: <SearchPage />,
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
                path: "/registerVendor",
                element: <RegisterVendorPage />,
            },
            {
                path: "/productVendor",
                element: <UserVendorSelect />,
            },
            {
                path: "/facturesVendor",
                element: <VendorFacturesPage />,
            },
            {
                path: "/managerVendor",
                element: <ManagerVendorPage />,
            },
            {
                path: "/addProduct",
                element: <ProductAddManager />,
            },
            {
                path: "/adminLogin",
                element: <AdminLoginPage />,
            },
            {
                path: "/admin",
                element: <AdminActivateVendors />,
            },
            {
                path: "/productsAdmin",
                element: <AdminProductsPage />,
            },
            {
                path: "/vendorsAdmin",
                element: <AdminVendorPage />,
            },
            {
                path: "/usersAdmin",
                element: <AdminUserPage />,
            },
            {
                path: "/productPage",
                element: <ProductPage />,
            },
            {
                path: "/accountPage",
                element: <AccountPage />,
            },
        ],
    },
]);

const theme = createTheme(themeOptions);
export const UserContext = React.createContext<RSessionUserData>({
    authUser: "",
    authToken: "",
    type: userType.undefined,
    productQuantity: NaN,
    setProductQuantity: (quantity: number) => NaN,
    setSession: (data: UserToken) => {
        data;
    },
    resetSession: () => false,
    checkSession: () => false,
});

function App() {
    const [user, setUser] = useState(localStorage.getItem("email") || "");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [type, setType] = useState<userType>(
        (localStorage.getItem("type") as userType) || undefined
    );
    const [productQuantity, setProductQuantity] = useState<number>(0);

    const setSessionData = (user: UserToken) => {
        console.log("SET SESSION::", user);
        setUser(user.email);
        setToken(user.token);
        setType(user.type);
        localStorage.setItem("email", user.email);
        localStorage.setItem("token", user.token);
        localStorage.setItem("type", user.type);
    };

    const resetSessionData = () => {
        setUser("");
        setToken("");
        setType(userType.undefined);
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("type");
    };

    const checkSessionData = (): boolean => {
        if (user === "" || token === "" || type === userType.undefined) {
            resetSessionData();
            return false;
        }
        return true;
    };

    return (
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <UserContext.Provider
                    value={{
                        authUser: user,
                        authToken: token,
                        type: type,
                        productQuantity: productQuantity,
                        setProductQuantity: setProductQuantity,
                        setSession: setSessionData,
                        resetSession: resetSessionData,
                        checkSession: checkSessionData,
                    }}
                >
                    <div id="main">
                        <RouterProvider
                            fallbackElement={<CircularProgress />}
                            router={router}
                        />
                    </div>
                </UserContext.Provider>
            </ThemeProvider>
        </React.StrictMode>
    );
}

export default App;
