import "../../App.css";
import LoginForm from "../../components/loginForm/LoginForm";
import VendorLoginForm from "../../components/vendorLoginForm/VendorLoginForm";
import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";
import { useNavigate } from "react-router-dom";

function VendorLoginPage() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(0);
  //const [isLogged, setIsLogged] = useState(false);
  //let attempt = 0;
  const [canSubmit, setSubmitActive] = useState(true);
  const onSubmit = (data: FieldValues) => {
    setSubmitActive(false);
    console.log("SUBMIT FORM");
    setAttempt(attempt + 1);
    const formatedData: LoginFields = {
      email: data.email as string,
      password: data.password as string,
      attempts: attempt,
    };
    const check = checkLoginFields(formatedData);
    if (check) {
      const login = httpsCallable(functions, "loginVendor");
      login(formatedData).then((result) => {
        const { msg, token } = result.data as any;
        localStorage.setItem("token", token);
        console.log(result);
        console.log(attempt);
        setSubmitActive(true);
        //setIsLogged(result.data as any);
        if (msg !== "") {
          window.alert(msg);
        }
        if (token !== "") {
          navigate("/session");
        }
      });
    }
  };
  return (
    <>
      <VendorLoginForm onSubmit={onSubmit} canSubmit={canSubmit} />
    </>
  );
}
export default VendorLoginPage;
