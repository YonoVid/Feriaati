import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FieldValues } from "react-hook-form";

import LoadingOverlay from "react-loading-overlay-ts";

import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";

import {
    editPasswordUser,
    recoverPasswordUser,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import PassRecoveryForm from "@feria-a-ti/web/src/components/forms/loginForm/PassRecoveryForm";
import UpdatePassword from "@feria-a-ti/web/src/components/forms/loginForm/UpdatePassword";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function RecoveryPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Navigation definition
    const navigate = useNavigate();
    //Form variables
    const [userEmail, setUserEmail] = useState("");
    const [canSubmit, setCanSubmit] = useState(true);
    const [changePass, setChangePass] = useState(true);

    const onSubmitRecoveryPass = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RecoveryFields = {
            email: data.email as string,
        };

        recoverPasswordUser(
            { formatedData, setCanSubmit, setMessage },
            (value: string) => {
                setUserEmail(value);
                setChangePass(false);
            }
        );
    };

    const onSubmitUpdatePass = (data: FieldValues) => {
        const formatedData: UpdatePassFields = {
            email: userEmail,
            codigo: data.codigo as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
        };

        editPasswordUser({ formatedData, setCanSubmit, setMessage }, () =>
            navigate("/login")
        );
    };
    return (
        <>
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
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
            </LoadingOverlay>
        </>
    );
}
export default RecoveryPage;
