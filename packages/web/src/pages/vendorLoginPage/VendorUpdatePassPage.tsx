import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";

import { UpdatePassFields } from "@feria-a-ti/common/model/loginFields";
import { functions } from "@feria-a-ti/common/firebase";
import { checkUpdatePassFields } from "@feria-a-ti/common/checkLoginFields";
import UpdatePassword from "@feria-a-ti/web/src/components/loginForm/UpdatePassword";

import "../../App.css";

function VendorUpdatePassPage() {
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
            const passUpdate = httpsCallable(functions, "passUpdateVendor");
            passUpdate(formatedData).then((result) => {
                const { msg } = result.data as any;

                console.log(result);
                console.log("hola");
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
export default VendorUpdatePassPage;
