import { FormProps } from "react-router-dom";
import type { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";
import { YearFactureResumeCollection } from "../functionsTypes";

export type DashboardComponentProps = FormProps & {
    date: Date;
    resumes: Map<number, YearFactureResumeCollection>;
};

export type RDashboardComponentProps = DashboardComponentProps;
