import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "../../../../common/theme/base";
import "./RegisterForm.css";
import { RRegisterFormProps } from "../../../../common/model/registerFormProps";
import { Link } from "react-router-dom";



function RegisterForm(props: RRegisterFormProps) {
    const { onSubmit } = props;
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        setError,
    } = useForm();

    return (
        <div
            className="formContainer"
            style={{ backgroundColor: colors.secondary }}
        >
            <h1 style={{ maxWidth: "80%" }}>REGISTRARSE</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputComponent
                    name="username"
                    label="Nombre de usuario"
                    onChange={controlValidInput}
                    required={true}
                    maxLength={25}
                    minLength={8}
                    registerForm={register}
                    error={errors.username}
                />
                <InputComponent
                    name="email"
                    type="email"
                    label="Correo electrónico"
                    required={true}
                    maxLength={254}
                    registerForm={register}
                    error={errors.email}
                />
                <InputComponent
                    name="password"
                    label="Contraseña"
                    type="password"
                    required={true}
                    maxLength={128}
                    minLength={10}
                    registerForm={register}
                    error={errors.password}
                />
                <InputComponent
                    name="confirmPassword"
                    label="Confirmar contraseña"
                    type="password"
                    required={true}
                    maxLength={254}
                    minLength={10}
                    registerForm={register}
                    watch={watch("password")}
                    setError={setError}
                    error={errors.confirmPassword}
                />
                <input
                    className="formButton"
                    style={{
                        color: colors.light,
                        backgroundColor: colors.secondaryShadow,
                    }}
                    type="submit"
                    value="Registrarse"
                    disabled={(props.canSubmit!=null)?!props.canSubmit:false}
                />
                 
            </form>
          <Link to={'/login'}>ayuda</Link>
        </div>
    );
}


export default RegisterForm;
