import { useForm } from "react-hook-form";
import { controlValidInput } from "@feria-a-ti/common/inputControl";
import InputComponent from "../inputComponent/InputComponent";
import { colors } from "../../../../common/theme/base";
import "./ConfirmRegisterForm.css";
import { RFormProps } from "../../../../common/model/registerFormProps";

function ConfirmRegisterForm(props: RFormProps) {
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
            <h1 style={{ maxWidth: "80%" }}>REGISTRARSE</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputComponent
                    name="code"
                    label="Código de confirmación"
                    onChange={controlValidInput}
                    required={true}
                    maxLength={6}
                    minLength={6}
                    registerForm={register}
                    error={errors.code}
                />
                <input
                    className="formButton"
                    style={{
                        color: colors.light,
                        backgroundColor: colors.secondaryShadow,
                    }}
                    type="submit"
                    value="Registrarse"
                    disabled={
                        props.canSubmit != null ? !props.canSubmit : false
                    }
                />
            </form>
        </div>
    );
}

export default ConfirmRegisterForm;
