import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeOptions } from "@feria-a-ti/common/theme/base";
import { SessionUserData } from "@feria-a-ti/common/model/sessionType";
import ErrorPage from "@feria-a-ti/web/src/pages/errorPage/ErrorPage";
import RegisterPage from "@feria-a-ti/web/src/pages/registerPage/RegisterPage";
import LoginPage from "@feria-a-ti/web/src/pages/loginPage/LoginPage";
import RecoveryPage from "@feria-a-ti/web/src/pages/loginPage/RecoveryPage";
import Home from "@feria-a-ti/web/src/pages/Home";
import SessionPage from "@feria-a-ti/web/src/pages/SessionPage";
import RegisterVendorPage from "@feria-a-ti/web/src/pages/registerVendorPage/RegisterVendorPage";
import AdminLoginPage from "@feria-a-ti/web/src/pages/adminPage/AdminLoginPage";
import VendorLoginPage from "@feria-a-ti/web/src/pages/vendorLoginPage/VendorLoginPage";
import VendorRecoveryPage from "@feria-a-ti/web/src/pages/vendorLoginPage/VendorRecoveryPage";
import ProductPage from "@feria-a-ti/web/src/pages/productPage/ProductPage";
import { HeaderLayout } from "@feria-a-ti/web/src/pages/HeaderLayout";
import ActivateVendors from "@feria-a-ti/web/src/pages/adminPage/ActivateVendors";
import { UserToken, userType } from "@feria-a-ti/common/model/functionsTypes";
import { CircularProgress } from "@mui/material";

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
      {
        path: "/productPage",
        element: <ProductPage />,
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

  const setSessionData = (user: UserToken) => {
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
