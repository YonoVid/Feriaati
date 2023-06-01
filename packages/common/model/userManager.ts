import { userStatus } from "./registerFields";

export type UpdateStateFields = {
  id: string;
  email: string;
  state: userStatus;
};
