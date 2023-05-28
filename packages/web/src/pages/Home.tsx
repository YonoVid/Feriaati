import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "@feria-a-ti/web/src/App";

function Home() {
    //Global state variable
    const { resetSession, type } = useContext(UserContext);

    const nav = useNavigate();

    const handleLogout = () => {
        resetSession && resetSession();
        nav("/login");
    };

    return (
        <>
            <h1>¡Bienvenido!</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </>
    );
}

export default Home;
