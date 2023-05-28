import { useContext, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Home from "../pages/Home";

import { UserContext } from "@feria-a-ti/web/src/App";

function SessionPage() {
    //Global state variable
    const { checkSession, authToken, type } = useContext(UserContext);

    const nav = useNavigate();

    useEffect(() => {
        if (checkSession && checkSession()) {
            nav("/home");
        }
    }, [authToken, nav, checkSession]);

    return (authToken && <Home />) || <Navigate to="/login" replace={true} />;
}

export default SessionPage;
