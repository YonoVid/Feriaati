import "../../App.css";
import LoginForm from "../../components/loginForm/LoginForm";
import { functions } from "@feria-a-ti/common/firebase";
import { checkLoginFields } from "@feria-a-ti/common/checkLoginFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { LoginFields } from "@feria-a-ti/common/model/loginFields";

function LoginPage() {
  const [attempt, setAttempt] = useState(0);
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
      const login = httpsCallable(functions, "login");
      login(formatedData).then((result) => {
        console.log(result);
        console.log(attempt);
        setSubmitActive(true);
      });
    }
  };
  return (
    <>
      <LoginForm onSubmit={onSubmit} canSubmit={canSubmit} />
    </>
  );
}
export default LoginPage;
