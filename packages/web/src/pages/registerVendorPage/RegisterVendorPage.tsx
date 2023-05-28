import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import { checkRegisterVendorFields } from "@feria-a-ti/common/checkRegisterFields";
import { messagesCode } from "@feria-a-ti/common/constants/errors";
import {
    RegisterVendorFields,
    userStatus,
} from "@feria-a-ti/common/model/registerFields";
import { ResponseData } from "@feria-a-ti/common/model/functionsTypes";
import MessageAlert from "@feria-a-ti/web/src/components/messageAlert/MessageAlert";
import RegisterVendorForm from "@feria-a-ti/web/src/components/registerVendorForm/RegisterVendorForm";
import "@feria-a-ti/web/src/App.css";

function RegisterVendorPage() {
    // Dom redirection variable
    const navigate = useNavigate();
    // Action to do on sucesfull form submit
    //const [emailRegistered, setEmailRegistered] = useState("");

    //Image data
    const [imageData, setImageData] = useState<string | ArrayBuffer>("");

    const [canRegister, setCanRegister] = useState(true);

    // Alert Related values
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("TEXT");
    const closeAlert = () => {
        setCanRegister(true);
        setShowAlert(false);
    };

    const onSubmitRegister = (data: FieldValues) => {
        //Lock register button
        setCanRegister(false);
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
            //Call firebase function to create user
            const addVendor = httpsCallable<
                RegisterVendorFields,
                ResponseData<any>
            >(functions, "addVendor");
            addVendor(formatedData)
                .then((result) => {
                    console.log(result);
                    //Unlock register button
                    setCanRegister(true);
                    //Show alert message
                    setAlertMessage(result.data?.msg);
                    navigate("/loginVendor");
                })
                .catch((error) => {
                    console.log(error);
                    setAlertMessage(messagesCode["ERR00"]);
                })
                .finally(() => setShowAlert(true));
        }
    };

    return (
        <>
            <RegisterVendorForm
                onSubmit={onSubmitRegister}
                canSubmit={canRegister}
                setImageData={setImageData}
            />
            <MessageAlert
                open={showAlert}
                title="Estado de acción"
                message={alertMessage}
                handleClose={closeAlert}
            />
        </>
    );
}

export default RegisterVendorPage;
