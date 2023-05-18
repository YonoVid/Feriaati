import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "../pages/loginPage/LoginPage";
import Home from "../pages/Home";

function SessionPage() {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      nav("/home");
    }
  }, [token, nav]);

  if (token) {
    return <Home />;
  } else {
    nav("/login");
  }
}

export default SessionPage;
