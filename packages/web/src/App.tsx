import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/errorPage/ErrorPage";
import RegisterPage from "./pages/registerPage/RegisterPage";

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
        element: <ErrorPage />,
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
