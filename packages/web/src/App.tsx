import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage/ErrorPage";
import RegisterPage from "./pages/registerPage/RegisterPage";
import LoginPage from "./pages/loginPage/LoginPage";
import RecoveryPage from "./pages/loginPage/RecoveryPage";
import UpdatePassPage from "./pages/loginPage/UpdatePassPage";
import Home from "./pages/Home";
import SessionPage from "./pages/SessionPage";

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
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
