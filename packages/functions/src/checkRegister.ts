import { RegisterFields } from "./types";

export const emailFormatRegex = new RegExp(
  "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)" +
  "*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const checkRegisterFields = (input: RegisterFields): {check: boolean, msg: string} => {
  const {username, email, password, confirmPassword} = input;
  let error = "";
  const userCheck = username != null && username.length < 18;
  if(!userCheck){error += "El nombre de usuario no tiene el formato correcto"}
    // console.log("Username check", userCheck);
  const emailCheck =
    email != null && emailFormatRegex.test(email) && email.length < 254;
  if(!emailCheck){
    if(error !== ""){error += "\n"}
    error += "El correo no tiene el formato correcto"
  }
    // console.log("Email check", emailCheck);
  const passwordCheck =
    password != null &&
    password.length < 128 &&
    password === confirmPassword;
  if(!passwordCheck){
    if(error !== ""){error += "\n"}
    error += "Las contraseñas no tiene el formato correcto o no son iguales"
  }
    // console.log("Password check", passwordCheck);

  return {check: userCheck && emailCheck && passwordCheck, msg:""};
};
