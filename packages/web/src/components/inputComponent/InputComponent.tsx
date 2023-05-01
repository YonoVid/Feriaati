import { ChangeEvent, useState } from "react";
import { RInputComponentProps } from "@feria-a-ti/common/model/inputProps";
import { emailFormatRegex } from "@feria-a-ti/common/checkRegisterFields";
import { colors } from "@feria-a-ti/common/theme/base";
import "./InputComponent.css";

function InputComponent(data: RInputComponentProps) {
    const {
        name,
        label,
        type,
        style,
        required,
        maxLength,
        minLength,
        registerForm,
        onChange,
        watch,
        setError,
        error,
    } = data;

    const inputLabel = label != null ? label : name;
    const [value, storeValue] = useState("");

    const onChangeWrapper = (event: ChangeEvent<HTMLInputElement>) => {
        storeValue(event.target.value);
        if (onChange != null) {
            onChange(event);
        }
        if (type === "email") {
            console.log(emailFormatRegex.test(value), value);
        }
    };

    const checkEqualPassword = () => {
        if (watch != null) {
            return watch.toString() !== value;
        }
        if (setError != null) {
            console.log("SETTING PASSSWORD ERROR");
            setError("notEqualPassword", { type: "custom" });
        }
        return false;
    };

    return (
        <>
            <div className="inputContainer" style={style}>
                <input
                    id={name + "Form"}
                    className="inputComponent"
                    style={{
                        color: colors.primaryShadow,
                        backgroundColor: colors.light,
                        borderColor: colors.primary,
                    }}
                    placeholder={inputLabel}
                    type={type != null ? type : "text"}
                    minLength={minLength}
                    maxLength={maxLength}
                    {...registerForm(name, {
                        required: required,
                        maxLength: maxLength,
                        minLength: minLength,
                        onChange: onChangeWrapper,
                    })}
                />
                {value !== "" && (
                    <div className="inputLabelWrapper">
                        <span
                            className="inputLabel"
                            style={{
                                color: colors.primaryShadow,
                                backgroundColor: colors.light,
                            }}
                        >
                            {inputLabel}
                        </span>
                    </div>
                )}
            </div>
            <div>
                {(error?.type === "required" && (
                    <label htmlFor={name + "Form"} className="inputLabel">
                        Campo es requerido
                    </label>
                )) ||
                    (error?.type === "minLength" && (
                        <label htmlFor={name + "Form"} className="inputLabel">
                            Campo debe tener más de {minLength} caracteres
                        </label>
                    )) ||
                    (error?.type === "maxLength" && (
                        <label htmlFor={name + "Form"} className="inputLabel">
                            Campo debe tener menos de {maxLength} caracteres
                        </label>
                    )) ||
                    (type === "email" &&
                        value != "" &&
                        !emailFormatRegex.test(value) && (
                            <label
                                htmlFor={name + "Form"}
                                className="inputLabel"
                            >
                                Formato de correo incorrecto Ej:
                                ejemplo@email.com
                            </label>
                        )) ||
                    (type === "password" &&
                        value != "" &&
                        checkEqualPassword() && (
                            <label
                                htmlFor={name + "Form"}
                                className="inputLabel"
                            >
                                Contraseñas no son iguales
                            </label>
                        ))}
            </div>
        </>
    );
}

export default InputComponent;
