import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import { Link } from "@mui/material";

import {
    RegisterVendorFields,
    userStatus,
} from "@feria-a-ti/common/model/fields/registerFields";
import { registerAccountVendor } from "@feria-a-ti/common/functions/account/registerFunctions";

import RegisterVendorForm from "@feria-a-ti/web/src/components/forms/registerVendorForm/RegisterVendorForm";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function RegisterVendorPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    // Dom redirection variable
    const navigate = useNavigate();

    //Image data
    const [imageData, setImageData] = useState<string | ArrayBuffer>("");

    const [canSubmit, setCanSubmit] = useState(true);

    const onSubmitRegister = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        //Format data to send to server
        const formatedData: RegisterVendorFields = {
            rut: data.rut as string,
            enterpriseName: data.enterpriseName as string,
            localNumber: data.localNumber as number,
            street: data.street as string,
            streetNumber: data.streetNumber as number,
            region: data.region as number,
            commune: data.commune as number,
            name: data.name as string,
            surname: data.surname as string,
            email: data.email as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
            status: userStatus.registered,
            image: imageData as ArrayBuffer, //Read image data,
        };

        registerAccountVendor(
            { formatedData, setCanSubmit, setMessage },
            () => {
                navigate("/loginVendor");
            }
        );
    };

    return (
        <>
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
                <RegisterVendorForm
                    onSubmit={onSubmitRegister}
                    setImageData={setImageData}
                    canSubmit={canSubmit}
                    setCanSubmit={setCanSubmit}
                >
                    <Link
                        component="button"
                        onClick={() => navigate("/loginVendor")}
                    >
                        Ya tengo una cuenta
                    </Link>
                </RegisterVendorForm>
            </LoadingOverlay>
        </>
    );
}

export default RegisterVendorPage;
