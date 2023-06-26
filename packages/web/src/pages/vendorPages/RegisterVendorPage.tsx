import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkRegisterVendorFields } from "@feria-a-ti/common/check/checkRegisterFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import {
    RegisterVendorFields,
    userStatus,
} from "@feria-a-ti/common/model/fields/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import RegisterVendorForm from "@feria-a-ti/web/src/components/forms/registerVendorForm/RegisterVendorForm";

import { useHeaderContext } from "../HeaderLayout";
import "@feria-a-ti/web/src/App.css";
import { Link } from "@mui/material";

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
        const check = checkRegisterVendorFields(formatedData);

        console.log("ERROR CHECK::", check);
        console.log("ERROR CHECK::", data);

        if (check) {
            //Lock register button
            setCanSubmit(false);
            //Call firebase function to create user
            const addVendor = httpsCallable<
                RegisterVendorFields,
                ResponseData<any>
            >(functions, "addVendor");
            addVendor(formatedData)
                .then((result) => {
                    const { msg, error } = result.data;
                    console.log(result);
                    //Show alert message
                    setMessage({ msg, isError: error });
                    navigate("/loginVendor");
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                })
                .finally(() => setCanSubmit(true)); //Unlock register button
        }
    };

    return (
        <>
            <RegisterVendorForm
                onSubmit={onSubmitRegister}
                canSubmit={canSubmit}
                setImageData={setImageData}
            >
                <Link
                    component="button"
                    onClick={() => navigate("/loginVendor")}
                >
                    Ya tengo una cuenta
                </Link>
            </RegisterVendorForm>
        </>
    );
}

export default RegisterVendorPage;
