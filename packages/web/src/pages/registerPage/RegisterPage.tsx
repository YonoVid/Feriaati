import "../../App.css";
import RegisterForm from "../../components/registerForm/RegisterForm";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { app } from "@feria-a-ti/common/firebase";
import { RegisterFields } from "@feria-a-ti/common/model/registerFields";
import { checkRegisterFields } from "@feria-a-ti/common/checkRegisterFields";
import { Field, FieldValues } from "react-hook-form";

function RegisterPage() {
    //Import and prepare firebase data and reference
    const auth = getAuth(app);
    //Action to do on sucesfull form submit
    const onSubmit = (data: FieldValues) => {
        console.log("SUBMIT FORM");
        const formatedData: RegisterFields = {
            username: data.username as string,
            email: data.email as string,
            password: data.password as string,
            confirmPassword: data.confirmPassword as string,
        };
        const check = checkRegisterFields(formatedData);

        console.log("ERROR CHECK::", check);

        if (check) {
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
            <RegisterForm onSubmit={onSubmit} />
        </>
    );
}

export default RegisterPage;
