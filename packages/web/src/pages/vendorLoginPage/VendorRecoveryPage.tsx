import "../../App.css";
import PassRecoveryForm from "../../components/loginForm/PassRecoveryForm";

import { functions } from "@feria-a-ti/common/firebase";
import {
  checkRecoveryFields,
  checkUpdatePassFields,
} from "@feria-a-ti/common/checkLoginFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import {
  RecoveryFields,
  UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import VendorPassRecoveryForm from "../../components/vendorLoginForm/VendorPassRecoveryForm";
import VendorUpdatePassword from "../../components/vendorLoginForm/VendorUpdatePassword";

function VendorRecoveryPage() {
  const [userEmail, setUserEmail] = useState("");

  const [canSubmit, setSubmitActive] = useState(true);
  const [changePass, setChangePass] = useState(true);
  const onSubmitRecoveryPass = (data: FieldValues) => {
    setSubmitActive(false);
    console.log("SUBMIT FORM");
    const formatedData: RecoveryFields = {
      email: data.email as string,
    };
    const check = checkRecoveryFields(formatedData);
    console.log(formatedData);
    if (check) {
      const passRecovery = httpsCallable(functions, "passRecoveryVendor");
      passRecovery(formatedData.email).then((result) => {
        window.alert("Código enviado con éxito");
        console.log(result);
        setSubmitActive(true);
        setUserEmail(data.email);
        setChangePass(false);
      });
    }
  };
  const onSubmitUpdatePass = (data: FieldValues) => {
    setSubmitActive(false);
    console.log("SUBMIT FORM");
    const formatedData: UpdatePassFields = {
      email: userEmail,
      codigo: data.codigo as string,
      password: data.password as string,
      confirmPassword: data.confirmPassword as string,
    };
    const check = checkUpdatePassFields(formatedData);
    if (check) {
      const passUpdate = httpsCallable(functions, "passUpdateVendor");
      passUpdate(formatedData).then((result) => {
        let { msg } = result.data as any;
        window.alert(msg);
        console.log(result);
        setSubmitActive(true);
      });
    }
  };
  return (
    <>
      {(changePass && (
        <VendorPassRecoveryForm
          onSubmit={onSubmitRecoveryPass}
          canSubmit={canSubmit}
        />
      )) || (
        <VendorUpdatePassword
          onSubmit={onSubmitUpdatePass}
          canSubmit={canSubmit}
        />
      )}
    </>
  );
}
export default VendorRecoveryPage;
