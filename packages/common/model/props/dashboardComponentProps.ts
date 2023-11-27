import { FormProps } from "react-router-dom";
import { YearFactureResumeCollection } from "../functionsTypes";

export type DashboardComponentProps = FormProps & {
    date: Date;
    resumes: Map<number, YearFactureResumeCollection>;
};

export type RDashboardComponentProps = DashboardComponentProps;
