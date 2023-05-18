import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Home from "../pages/Home";

function SessionPage() {
    const nav = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            nav("/home");
        }
    }, [token, nav]);
    return (token && <Home />) || <Navigate to="/login" replace={true} />;
}

export default SessionPage;
