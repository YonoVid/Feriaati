import { DayTime } from "../baseTypes";
import { ContributorLevel } from "../functionsTypes";
import { UserRequestFields } from "./fields";

export type UpdatePassFields = {
    email: string;
    codigo: string;
    password: string;
    confirmPassword: string;
};

export type DayTimeRange = { start: DayTime; end: DayTime };

export type UpdateProductVendorFields = UserRequestFields & {
    productVendorId: string;
    image?: string;
    serviceTime?: DayTimeRange;
    contactPhone?: string;
    contactEmail?: string;
};

export type UpdateContributorFields = UserRequestFields & {
    contributorId: string;
    productsId: string;
    name?: string;
    surname?: string;
    password?: string;
    confirmPassword?: string;
    permission?: ContributorLevel;
};
