import { FieldValues, useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";

export type RegisterFormProps = {
    actionOnSubmit: (data: FieldValues) => void;
};

function RegisterForm(registerFormProps: RegisterFormProps) {
    const { actionOnSubmit } = registerFormProps;
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
        if (data.email != null && data.password != null) {
            actionOnSubmit(data);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputComponent
                    name="username"
                    onChange={controlValidInput}
                    required={true}
                    maxLength={25}
                    minLength={8}
                    hookForm={register}
                    error={errors.username}
                />
                <InputComponent
                    name="email"
                    required={true}
                    maxLength={254}
                    hookForm={register}
                    error={errors.email}
                />
                <InputComponent
                    name="password"
                    required={true}
                    maxLength={128}
                    minLength={10}
                    onChange={checkPassword}
                    hookForm={register}
                    error={errors.password}
                />
                <InputComponent
                    name="confirmPassword"
                    required={true}
                    maxLength={254}
                    minLength={10}
                    hookForm={register}
                    error={errors.confirmPassword}
                />
                <div>
                    {!passwordVerificationEqual && (
                        <p>Las contraseñas no son iguales</p>
                    )}
                </div>
                <input type="submit" />
            </form>
        </>
    );
}

export default RegisterForm;
