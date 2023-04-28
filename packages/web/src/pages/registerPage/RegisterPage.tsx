import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";
import "../../App.css";
import RegisterForm from "../../components/registerForm/RegisterForm";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";
import { app } from "@feria-a-ti/common/firebase";
import { FieldValues } from "react-hook-form";

function RegisterPage() {
    //Import and prepare firebase data and reference
    const auth = getAuth(app);
    //Action to do on sucesfull form submit
    const onSubmit = (data: FieldValues) => {
        if (!data.errors) {
            console.log(data);
        }
        if (auth != null && data.email != null && data.password != null) {
            sendSignInLinkToEmail(auth, data.email, data.password)
                .then(() => {
                    window.localStorage.setItem("emailForSignIn", data.email);
                })
                .catch((error) => {
                    console.log(error.code, error.message);
                });
        }
    };

    return (
        <div>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Registrar usuario</h1>
            <div className="card">
                <RegisterForm actionOnSubmit={onSubmit} />
            </div>
        </div>
    );
}

export default RegisterPage;
