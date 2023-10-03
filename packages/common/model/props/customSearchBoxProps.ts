import { FormProps } from "react-router-dom";
import type { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";

export type CustomSearchBoxComponentProps = FormProps & {
    label?: string;
    filter?: string;
    loadSize?: number;
    onReload?: () => void;
};

export type RCustomSearchBoxComponentProps = SearchBoxConnectorParams &
    CustomSearchBoxComponentProps & {
        loadData?: (index: number) => void;
    };
