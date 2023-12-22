import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import {
    RecoveryFields,
    UpdatePassFields,
} from "@feria-a-ti/common/model/fields/loginFields";

import {
    editPasswordVendor,
    recoverPasswordVendor,
} from "@feria-a-ti/common/functions/account/accountFunctions";

import PassRecoveryForm from "@feria-a-ti/web/src/components/forms/loginForm/PassRecoveryForm";
import UpdatePassword from "@feria-a-ti/web/src/components/forms/loginForm/UpdatePassword";

import { useHeaderContext } from "../HeaderFunction";
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

        recoverPasswordVendor(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                setUserEmail(data);
                setChangePass(false);
            }
        );
    };

    const onSubmitUpdatePass = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: UpdatePassFields = {
            email: userEmail,
            codigo: data.codigo as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
        };

        editPasswordVendor({ formatedData, setCanSubmit, setMessage }, () => {
            navigate("/loginVendor");
        });
    };

    return (
        <>
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
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
            </LoadingOverlay>
        </>
    );
}
export default VendorRecoveryPage;
