import { FieldValues, useForm } from "react-hook-form";
import {
    getAuth,
    createUserWithEmailAndPassword,
    sendSignInLinkToEmail,
} from "firebase/auth";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import { app } from "@feria-a-ti/common/firebase";

function RegisterForm() {
    const auth = getAuth(app);
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
    } = useForm();

    let passwordVerificationEqual = true;
    const passwordValue = watch("password");

    const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("CHECK PASSWORD::", e);
        console.log(passwordValue);
        if (e.target.value != null) {
            passwordVerificationEqual = passwordValue === e.target.value;
        }
    };

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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <input
                        type="text"
                        maxLength={25}
                        {...register("username", {
                            onChange: controlValidInput,
                            required: true,
                            maxLength: 25,
                        })}
                    />
                    {errors.username?.type === "required" && (
                        <p>Campo es requerido</p>
                    )}
                    {errors.username?.type === "maxLength" && (
                        <p>Campo debe tener menos de 25 caracteres</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        maxLength={254}
                        {...register("email", {
                            required: true,
                            maxLength: 254,
                        })}
                    />
                    {errors.email?.type === "required" && (
                        <p>Campo es requerido</p>
                    )}
                    {errors.email?.type === "maxLength" && (
                        <p>Campo debe tener menos de 254 caracteres</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        minLength={10}
                        maxLength={128}
                        {...register("password", {
                            required: true,
                            maxLength: 128,
                            minLength: 10,
                        })}
                    />
                    {errors.password?.type === "required" && (
                        <p>Campo es requerido</p>
                    )}
                    {errors.password?.type === "maxLength" && (
                        <p>Campo debe tener menos de 128 caracteres</p>
                    )}
                </div>
                <div>
                    <input
                        type="text"
                        maxLength={128}
                        {...register("confirmPassword", {
                            onChange: checkPassword,
                            required: true,
                            maxLength: 128,
                            minLength: 10,
                        })}
                    />
                    {!passwordVerificationEqual && (
                        <p>Las contraseñas no son iguales</p>
                    )}
                    {errors.confirmPassword?.type === "required" && (
                        <p>Campo es requerido</p>
                    )}
                    {errors.confirmPassword?.type === "maxLength" && (
                        <p>Campo debe tener menos de 128 caracteres</p>
                    )}
                </div>
                <input type="submit" />
            </form>
        </>
    );
}

export default RegisterForm;
