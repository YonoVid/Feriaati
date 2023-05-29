import "../../App.css";
import PassRecoveryForm from "../../components/loginForm/PassRecoveryForm";
import { useNavigate } from "react-router-dom";

import { functions } from "@feria-a-ti/common/firebase";
import {
    checkRecoveryFields,
    checkUpdatePassFields,
} from "@feria-a-ti/common/check/checkLoginFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/loginFields";
import UpdatePassword from "../../components/loginForm/UpdatePassword";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import MessageAlert from "../../components/messageAlert/MessageAlert";

function RecoveryPage() {
    const [userEmail, setUserEmail] = useState("");
    //Navigation definition
    const navigate = useNavigate();
    //Form variables
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
            >(functions, "passRecovery");
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
        const formatedData: UpdatePassFields = {
            email: userEmail,
            codigo: data.codigo as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
        };
        const check = checkUpdatePassFields(formatedData);
        console.log("SUBMIT FORM::", formatedData);
        if (check) {
            setSubmitActive(false);
            const passUpdate = httpsCallable<
                UpdatePassFields,
                ResponseData<string>
            >(functions, "passUpdate");
            passUpdate(formatedData)
                .then((result) => {
                    const { error, msg } = result.data;
                    console.log(result);
                    setAlertMessage(msg);
                    if (!error) {
                        navigate("/login");
                    }
                })
                .finally(() => setShowAlert(true));
        }
    };
    return (
        <>
            {changePass ? (
                <PassRecoveryForm
                    onSubmit={onSubmitRecoveryPass}
                    canSubmit={canSubmit}
                />
            ) : (
                <UpdatePassword
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
export default RecoveryPage;
