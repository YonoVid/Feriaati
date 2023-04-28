import { InputComponentProps } from "@feria-a-ti/common/inputControl";
import "./InputComponent.css";

function InputComponent(data: InputComponentProps) {
    const { name, style, required, maxLength, minLength, hookForm, error } =
        data;
    return (
        <div className="inputContainer" style={style}>
            <input
                id={name + "Form"}
                className="inputLabel"
                type="text"
                minLength={minLength}
                maxLength={maxLength}
                {...hookForm(name, {
                    required: required,
                    maxLength: maxLength,
                    minLength: minLength,
                })}
            />
            <div>
                {error?.type === "required" && (
                    <label htmlFor={name + "Form"} className="inputLabel">
                        Campo es requerido
                    </label>
                )}
                {error?.type === "minLength" && (
                    <label htmlFor={name + "Form"} className="inputLabel">
                        Campo debe tener más de {minLength} caracteres
                    </label>
                )}
                {error?.type === "maxLength" && (
                    <label htmlFor={name + "Form"} className="inputLabel">
                        Campo debe tener menos de {maxLength} caracteres
                    </label>
                )}
            </div>
        </div>
    );
}

export default InputComponent;
