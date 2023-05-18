import {
  LoginFields,
  RecoveryFields,
  UpdatePassFields,
} from "./model/loginFields";

export const emailFormatRegex = new RegExp(
  "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
  "i"
);

export const checkLoginFields = (input: LoginFields): boolean => {
  const { email, password } = input;

  // console.log("Username check", userCheck);
  const emailCheck =
    email != null && emailFormatRegex.test(email) && email.length < 254;
  // console.log("Email check", emailCheck);
  const passwordCheck = password != null;

  return emailCheck && passwordCheck;
};
export const checkRecoveryFields = (input: RecoveryFields): boolean => {
  const { email } = input;

  // console.log("Username check", userCheck);
  const emailCheck =
    email != null && emailFormatRegex.test(email) && email.length < 254;
  // console.log("Email check", emailCheck);

  return emailCheck;
};

export const checkUpdatePassFields = (input: UpdatePassFields): boolean => {
  const { codigo, password, confirmPassword } = input;

  const codeCheck = codigo != null;

  const passwordCheck =
    password != null && password.length < 128 && password === confirmPassword;
  // console.log("Password check", passwordCheck);

  return codeCheck && passwordCheck;
};
