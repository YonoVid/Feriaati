import { UpdatePassFields } from "./types";

export const emailFormatRegex = new RegExp(
  "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
    "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
  "i"
);

export const checkUpdatePassFields = (
  input: UpdatePassFields
): { check: boolean; msg: string } => {
  const { codigo, password, confirmPassword } = input;
  let error = "";
  const codeCheck = codigo != null;

  const passwordCheck =
    password != null && password.length < 128 && password === confirmPassword;
  if (!passwordCheck) {
    if (error !== "") {
      error += "\n";
    }
    error += "Las contraseñas no tiene el formato correcto o no son iguales";
  }
  // console.log("Password check", passwordCheck);

  return { check: codeCheck && passwordCheck, msg: "" };
};
