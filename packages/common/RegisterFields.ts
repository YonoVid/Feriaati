export type UserFields = {
    username: string;
    email: string;
    password: string;
};

export type RegisterFields = UserFields & {
    confirmPassword: string;
};
