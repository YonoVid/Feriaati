import { OpinionValue } from "./comments/commentsFields";
import { DayTimeRange } from "./fields/updateFields";

//Response Data
export type ResponseData<T> = {
    error: boolean;
    code: string;
    msg: string;
    extra?: T | any;
};

export type UserToken = {
    id: string;
    email: string;
    token: string;
    type: userType;
};

export type ProductData = ProductCollectionData & {
    id: string;
};

export type ProductListData = ProductListCollectionData & {
    id: string;
};

export type VendorData = VendorCollectionData & {
    id: string;
};

export type UserData = UserCollectionData & {
    id: string;
};

//
// LOGIC DATA
//

export type LogicalData = {
    isDeleted: boolean;
    deletedDate?: Date;
    userDelete?: string;
    updateDate?: Date;
    userUpdate?: string;
};

//
// VENDOR PAGE TYPES
//

export type UserCommentList = {
    own: UserComment;
    comments: Array<UserComment>;
};

export type UserComment = {
    id?: string;
    userId: string;
    username?: string;
    comment: string;
    opinion: OpinionValue;
};

export type CommentCollectionData = UserComment & {
    date: Date;
    reports?: number;
};

//
// ACCOUNTS RELATED TYPES
//

export enum userType {
    admin = "admin",
    user = "user",
    vendor = "vendor",
    contributor = "contributor",
    temp = "temp",
    undefined = "undefined",
}

export enum userStatus {
    registered = "registered",
    activated = "activated",
    blocked = "blocked",
}

export type AccountDirection = {
    type?: "house" | "department" | "";
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    extra?: string;
};

export type AccountUser = {
    id?: string;
    type: userType;
    email: string;
    password: string;
    creationDate: Date;
    status: string;
    token?: string;
};

export type AccountData = AccountUser & {
    phone?: string;
    direction?: Array<AccountDirection>;
    subscription?: ActualSubscription;
};

export enum ContributorLevel {
    MANAGER = "manager",
    CASHIER = "cashier",
    VIEWER = "viewer",
}

export type ContributorData = AccountData & {
    status: userStatus;
    name: string;
    surname: string;
    permissions: ContributorLevel;
    productsId: string;
};

export type AccountCollectionData = LogicalData &
    AccountUser & {
        algorithm: string;
        status: string;
        iv: ArrayBuffer;
        code: string;
    };

export type UserCollectionData = AccountCollectionData & {
    username: string;
};

export type VendorCollectionData = AccountCollectionData & {
    rut: string;
    enterpriseName: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    name: string;
    surname: string;
    image: string;
    productsId: string | undefined;
};

//
// PRODUCTS RELATED DATA
//

export type ProductListCollectionData = LogicalData & {
    rating?: { positive: number; negative: number };
    enterpriseName: string;
    rut: string;
    localNumber: number;
    region: number;
    commune: number;
    street: string;
    streetNumber: number;
    image: string;
    serviceTime?: DayTimeRange;
    contact?: { phone: string; email: string };
    vendorId: string;
};

export enum ProductDiscount {
    NONE = "none",
    PERCENTAGE = "percentage",
    VALUE = "value",
}

export enum ProductUnit {
    UNIT = "none",
    GRAM = "gram",
    KILOGRAM = "kilogram",
}

export type ProductCollectionData = {
    name: string;
    description: string;
    unitType: ProductUnit;
    unit?: number;
    price: number;
    discount: ProductDiscount;
    promotion?: number;
    image: [string, string, string] | string;
    subscription?: ActualSubscription;
};

export type ProductFactureData = {
    id: string;
    name: string;
    quantity: number;
    subtotal: number;
};

export enum FactureStatus {
    APPROVED = "approved",
    PROCESSING = "processing",
    CANCELED = "canceled",
    NEGATED = "negated",
}

export type FactureData = {
    id: string;
    status: FactureStatus;
    date: TimeDate;
    products: Array<ProductFactureData>;
};

export type ActualSubscription = {
    expiration: TimeDate;
    renovation: true;
};

export type SubscriptionData = {
    amountBase: number;
    amountYear: number;
    expirationDate?: TimeDate;
    type: userType;
};

export type TimeDate = {
    seconds: number;
    nanoseconds: number;
};

export type FactureResumeCollection = {
    products: {
        [id: string]: { name: string; quantity: number; subtotal: number };
    };
    transactions: number;
    totalIncome: number;
};

export type YearFactureResumeCollection = {
    day: { [id: number]: FactureResumeCollection };
    month: { [id: number]: FactureResumeCollection };
    year: number;
    transactions: number;
    totalIncome: number;
    lastUpdate: Date;
};
