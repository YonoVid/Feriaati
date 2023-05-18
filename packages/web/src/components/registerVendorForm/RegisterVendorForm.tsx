import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "@feria-a-ti/common/theme/base";
import "./RegisterVendorForm.css";
import { RRegisterFormProps } from "@feria-a-ti/common/model/registerFormProps";
import { Button } from "@mui/material";
import InputComponentAlt from "../inputComponent/InputComponentAlt";

function RegisterVendorForm(props: RRegisterFormProps) {
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
                    name="rut"
                    label="RUT"
                    required={true}
                    registerForm={register}
                    error={errors.rut}
                />
                <InputComponent
                    name="localNumber"
                    label="Número de local"
                    required={true}
                    registerForm={register}
                    error={errors.localNumber}
                />
                <InputComponent
                    name="enterpriseName"
                    label="Nombre de la empresa"
                    required={true}
                    registerForm={register}
                    error={errors.enterpriseName}
                />
                <InputComponent
                    name="name"
                    label="Nombre"
                    onChange={controlValidInput}
                    required={true}
                    registerForm={register}
                    error={errors.name}
                />
                <InputComponent
                    name="surname"
                    label="Apellido"
                    onChange={controlValidInput}
                    required={true}
                    registerForm={register}
                    error={errors.surname}
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
                <InputComponentAlt
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
                    Registrar cuenta de vendedor
                </Button>
            </form>
        </div>
    );
}

export default RegisterVendorForm;
