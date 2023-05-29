import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import {
    checkRecoveryFields,
    checkUpdatePassFields,
} from "@feria-a-ti/common/check/checkLoginFields";
import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";

import PassRecoveryForm from "@feria-a-ti/web/src/components/loginForm/PassRecoveryForm";
import UpdatePassword from "@feria-a-ti/web/src/components/loginForm/UpdatePassword";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";

import "../../App.css";

function VendorRecoveryPage() {
    const [userEmail, setUserEmail] = useState("");
    //Navigation definition
    const navigate = useNavigate();

    const [canSubmit, setSubmitActive] = useState(true);
    const [changePass, setChangePass] = useState(true);

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        setSubmitActive(true);
        setShowAlert(false);
    };

    const onSubmitRecoveryPass = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RecoveryFields = {
            email: data.email as string,
        };
        const check = checkRecoveryFields(formatedData);
        console.log(formatedData);
        if (check) {
            setSubmitActive(false);
            const passRecovery = httpsCallable<
                RecoveryFields,
                ResponseData<string>
            >(functions, "passRecoveryVendor");
            passRecovery(formatedData)
                .then((result) => {
                    const { error, msg } = result.data;
                    console.log(result);
                    setAlertMessage(msg);
                    if (!error) {
                        setUserEmail(data.email);
                        setChangePass(false);
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    const onSubmitUpdatePass = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: UpdatePassFields = {
            email: userEmail,
            codigo: data.codigo as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
        };
        const check = checkUpdatePassFields(formatedData);
        if (check) {
            setSubmitActive(false);
            const passUpdate = httpsCallable<
                UpdatePassFields,
                ResponseData<string>
            >(functions, "passUpdateVendor");
            passUpdate(formatedData)
                .then((result) => {
                    const { error, msg } = result.data;
                    console.log(result);
                    setAlertMessage(msg);
                    if (!error) {
                        navigate("/loginVendor");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
            {(changePass && (
                <PassRecoveryForm
                    label="Recuperar cuenta de vendedor"
                    color="secondary"
                    onSubmit={onSubmitRecoveryPass}
                    canSubmit={canSubmit}
                />
            )) || (
                <UpdatePassword
                    color="secondary"
                    onSubmit={onSubmitUpdatePass}
                    canSubmit={canSubmit}
                />
            )}
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}
export default VendorRecoveryPage;
