import { useForm } from "react-hook-form";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "@feria-a-ti/common/theme/base";
import "./LoginForm.css";
import { RRecoveryFormProps } from "@feria-a-ti/common/model/loginFormProps";

function RecoveryForm(props: RRecoveryFormProps) {
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
      <h1 style={{ maxWidth: "100%" }}>Recuperar Contraseña</h1>
      <h3 style={{ maxWidth: "100%" }}>Ingrese su correo</h3>
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

        <input
          className="formButton"
          style={{
            color: colors.light,
            backgroundColor: colors.secondaryShadow,
          }}
          type="submit"
          value="Enviar Código"
          disabled={props.canSubmit != null ? !props.canSubmit : false}
        />
      </form>
    </div>
  );
}

export default RecoveryForm;
