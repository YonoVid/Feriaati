export type LogicalData = {
    isDeleted: boolean;
    deletedDate?: Date;
    userDelete?: string;
    updateDate?: Date;
    userUpdate?: string;
};

export type TimeDate = {
    seconds: number;
    nanoseconds: number;
};
