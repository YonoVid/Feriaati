import { LoginFields } from "./model/loginFields";

export const emailFormatRegex = new RegExp(
    "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$",
    "i"
);

export const checkLoginFields = (input: LoginFields): boolean => {
    const {email, password } = input;
    
    // console.log("Username check", userCheck);
    const emailCheck =
        email != null && emailFormatRegex.test(email) && email.length < 254;
    // console.log("Email check", emailCheck);
    const passwordCheck =
        password != null
        
       
    

    return emailCheck && passwordCheck;
};