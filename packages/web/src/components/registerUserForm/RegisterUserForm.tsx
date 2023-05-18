import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "@feria-a-ti/common/theme/base";
import "./RegisterUserForm.css";
import { RRegisterFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

function RegisterUserForm(props: RRegisterFormProps) {
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
            <h1>REGISTRARSE</h1>
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
                <Button
                    color="secondary"
                    type="submit"
                    variant="contained"
                    disabled={
                        props.canSubmit != null ? !props.canSubmit : false
                    }
                >
                    Registrar cuenta de comprador
                </Button>
            </form>
            <Link to={"/login"}>Ya tienes una cuenta? Inicia Sesión</Link>
        </div>
    );
}

export default RegisterUserForm;
