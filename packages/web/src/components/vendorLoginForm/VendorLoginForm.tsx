import { useForm } from "react-hook-form";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "@feria-a-ti/common/theme/base";
import "./LoginForm.css";
import { RLoginFormProps } from "@feria-a-ti/common/model/loginFormProps";
import { Link } from "react-router-dom";

function VendorLoginForm(props: RLoginFormProps) {
  const { onSubmit } = props;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  return (
    <div
      className="formContainer"
      style={{ backgroundColor: colors.secondary }}
    >
      <h1 style={{ maxWidth: "100%" }}>Inicio sesión vendedor</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <input
          className="formButton"
          style={{
            color: colors.light,
            backgroundColor: colors.secondaryShadow,
          }}
          type="submit"
          value="Iniciar sesion"
          disabled={props.canSubmit != null ? !props.canSubmit : false}
        />
      </form>
      <Link to={"/register"}>No tienes una cuenta? Registrate</Link>
      <br />
      <Link to={"/recoveryVendor"}>Olvidaste tu contraseña?</Link>
    </div>
  );
}

export default VendorLoginForm;
