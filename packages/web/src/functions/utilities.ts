import { UserToken } from "@feria-a-ti/common/model/functionsTypes";

export const setupLogin = (data: UserToken) => {
    localStorage.setItem("email", data.email);
    localStorage.setItem("token", data.token);
    localStorage.setItem("type", data.type);
};

export const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
};
