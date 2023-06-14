import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { UserContext } from "@feria-a-ti/web/src/App";
import { userType } from "@feria-a-ti/common/model/functionsTypes";

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
            {type === userType.undefined && (
                <Navigate to="/login" replace={true} />
            )}
            {type === userType.vendor && (
                <Navigate to="/managerVendor" replace={true} />
            )}
            {type === userType.user && (
                <Navigate to="/productVendor" replace={true} />
            )}
            <h1>¡Bienvenido!</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </>
    );
}

export default Home;
