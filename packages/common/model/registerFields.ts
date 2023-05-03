export enum userStatus {
    registered = "registered",
    activated = "activated",
    blocked = "blocked",
}

export type UserFields = {
    username: string;
    email: string;
    password: string;
    status?: userStatus;
};

export type RegisterFields = UserFields & {
    confirmPassword: string;
};
