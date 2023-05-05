export enum userStatus{
  registered = "registered",
  activated = "activated",
  blocked = "blocked"
}

export type UserFields = {
  username: string;
  email: string;
  password: string;
  status? : userStatus;
};

export type RegisterFields = UserFields & {
  confirmPassword: string;
};

export type RegisterConfirm = {
  email: string;
  code: string;
};

export type UserCollectionData = {
  username: string;
  email: string;
  password: string;
  algorithm: string;
  status: string;
  iv: ArrayBuffer;
  code: string;
}
