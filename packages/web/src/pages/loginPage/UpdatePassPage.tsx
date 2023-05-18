import "../../App.css";
import { functions } from "@feria-a-ti/common/firebase";
import { checkUpdatePassFields } from "@feria-a-ti/common/checkLoginFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { UpdatePassFields } from "@feria-a-ti/common/model/loginFields";
import UpdatePassword from "../../components/loginForm/UpdatePassword";

function UpdatePassPage() {
  const [canSubmit, setSubmitActive] = useState(true);
  const onSubmit = (data: FieldValues) => {
    
    setSubmitActive(false);
    console.log("SUBMIT FORM");
    window.alert("hla");
    const formatedData: UpdatePassFields = {
      email: data.email as string,
      codigo: data.codigo as string,
      password: data.password as string,
      confirmPassword: data.confirmPassword as string,
    };
    const check = checkUpdatePassFields(formatedData);
    if (check) {
      const passUpdate = httpsCallable(functions, "passUpdate");
      passUpdate(formatedData).then((result) => {
        const {msg} = result.data as any;
        
        
        console.log(result);
        console.log("hola")
        setSubmitActive(true);
        window.alert(msg);
      });
    }
  };
  return (
    <>
      <UpdatePassword onSubmit={onSubmit} canSubmit={canSubmit} />
    </>
  );
}
export default UpdatePassPage;
