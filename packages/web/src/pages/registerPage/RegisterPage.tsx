import "../../App.css";
import RegisterForm from "../../components/registerForm/RegisterForm";
import { functions } from "@feria-a-ti/common/firebase";
import { RegisterFields, userStatus } from "@feria-a-ti/common/model/registerFields";
import { checkRegisterFields } from "@feria-a-ti/common/checkRegisterFields";
import { FieldValues } from "react-hook-form";
import { httpsCallable } from "firebase/functions";
import { useState } from "react";

function RegisterPage() {
    //Import and prepare firebase data and reference
    //const auth = getAuth(app);
    //Action to do on sucesfull form submit
    const [canSubmit, setSubmitActive] = useState(true);

    const onSubmit = (data: FieldValues) => {
        setSubmitActive(false);
        console.log("SUBMIT FORM");
        const formatedData: RegisterFields = {
            username: data.username as string,
            email: data.email as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
            status: userStatus.registered
        };
        const check = checkRegisterFields(formatedData);

        console.log("ERROR CHECK::", check);

        if (check) {
            const addUser = httpsCallable(functions, 'addUser');
            addUser(formatedData).then((result) => {
                console.log(result);
                setSubmitActive(true);
            })
            // sendSignInLinkToEmail(auth, data.email, {})
            //     .then(() => {
            //         window.localStorage.setItem("emailForSignIn", data.email);
            //     })
            //     .catch((error) => {
            //         console.log(error.code, error.message);
            //     });
        }
    };

    return (
        <>
            <RegisterForm onSubmit={onSubmit} canSubmit={canSubmit}/>
        </>
    );
}

export default RegisterPage;
