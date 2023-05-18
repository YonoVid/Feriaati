import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "../../../../common/theme/base";
import "./LoginForm";
import { RUpdatepPassFormProps } from "../../../../common/model/loginFormProps";
import { Link } from "react-router-dom";
//import { Link } from "react-router-dom";

function UpdatePassForm(props: RUpdatepPassFormProps) {
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
      <h1 style={{ maxWidth: "100%" }}>Intoduce nueva contraseña</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputComponent
          name="codigo"
          label="Código"
          onChange={controlValidInput}
          required={true}
          maxLength={6}
          minLength={6}
          registerForm={register}
          error={errors}
        />

        <InputComponent
          name="password"
          label="Ingrese nueva contraseña"
          type="password"
          required={true}
          maxLength={128}
          minLength={10}
          registerForm={register}
          error={errors.password}
        />
        <InputComponent
          name="confirmPassword"
          label="Confirmar nueva contraseña"
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
          value="Cambiar contraseña"
          disabled={props.canSubmit != null ? !props.canSubmit : false}
        />
      </form>
      <Link to={"/login"}>Ir a iniciar sesión</Link>
    </div>
  );
}

export default UpdatePassForm;
