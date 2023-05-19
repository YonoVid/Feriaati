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
export type LoginFields = {
  email: string;
  password: string;
  attempts: number;
};
export type RecoveryFields = {
  email: string;
};

export type UpdatePassFields = {
  email: string;
  codigo: string;
  password: string;
  confirmPassword: string;
};

export type UpdateStateFields = {
  id: string;
  email: string;
  state: userStatus;
};
