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

import PassRecoveryForm from "@feria-a-ti/web/src/components/forms/loginForm/PassRecoveryForm";
import UpdatePassword from "@feria-a-ti/web/src/components/forms/loginForm/UpdatePassword";

import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

function VendorRecoveryPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Navigation definition
    const navigate = useNavigate();

    //Form related variables
    const [userEmail, setUserEmail] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);
    const [changePass, setChangePass] = useState(true);

    const onSubmitRecoveryPass = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RecoveryFields = {
            email: data.email as string,
        };
        const check = checkRecoveryFields(formatedData);
        console.log(formatedData);
        if (check) {
            setCanSubmit(false);
            const passRecovery = httpsCallable<
                RecoveryFields,
                ResponseData<string>
            >(functions, "passRecoveryVendor");
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
                .finally(() => setCanSubmit(true));
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
            setCanSubmit(false);
            const passUpdate = httpsCallable<
                UpdatePassFields,
                ResponseData<string>
            >(functions, "passUpdateVendor");
            passUpdate(formatedData)
                .then((result) => {
                    const { error, msg } = result.data;
                    console.log(result);
                    setMessage({ msg, isError: error });
                    if (!error) {
                        navigate("/loginVendor");
                    }
                })
                .finally(() => setCanSubmit(true));
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
        </>
    );
}
export default VendorRecoveryPage;
