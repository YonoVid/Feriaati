import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
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
