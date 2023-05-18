import { LoginFields } from "./types";

export const emailFormatRegex = new RegExp(
  "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
    "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
  "i"
);

export const checkLoginFields = (
  input: LoginFields
): { check: boolean; msg: string } => {
  const { email, password } = input;
  let error = "";

  const emailCheck =
    email != null && emailFormatRegex.test(email) && email.length < 254;
  if (!emailCheck) {
    error += "El correo no tiene el formato correcto";
  }
  // console.log("Email check", emailCheck);
  const passwordCheck = password != null && password.length < 128;
  if (!emailCheck) {
    if (error !== "") {
      error += "\n";
    }
    error += "pass mala";
  }

  // console.log("Password check", passwordCheck);

  return { check: emailCheck && passwordCheck, msg: "" };
};
