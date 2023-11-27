import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import {
    checkRecoveryFields,
    checkUpdatePassFields,
} from "@feria-a-ti/common/check/checkLoginFields";
import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";

import PassRecoveryForm from "@feria-a-ti/web/src/components/forms/loginForm/PassRecoveryForm";
import UpdatePassword from "@feria-a-ti/web/src/components/forms/loginForm/UpdatePassword";

import { useHeaderContext } from "../HeaderFunction";
import "../../App.css";

function RecoveryPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Navigation definition
    const navigate = useNavigate();
    //Form variables
    const [userEmail, setUserEmail] = useState("");
    const [canSubmit, setSubmitActive] = useState(true);
    const [changePass, setChangePass] = useState(true);

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
                    setMessage({ msg, isError: error });
                    if (!error) {
                        setUserEmail(data.email);
                        setChangePass(false);
                    }
                })
                .finally(() => setSubmitActive(true));
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
                    setMessage({ msg, isError: error });
                    if (!error) {
                        navigate("/login");
                    }
                })
                .finally(() => setSubmitActive(true));
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
        </>
    );
}
export default RecoveryPage;
