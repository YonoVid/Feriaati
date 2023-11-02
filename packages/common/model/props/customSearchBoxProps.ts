import { FormProps } from "react-router-dom";
import type { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";

export type CustomSearchBoxComponentProps = FormProps &
    SearchBoxConnectorParams & {
        label?: string;
        filter?: string;
        loadSize?: number;
        filterMenu?: () => void;
        onReload?: () => void;
        loadData?: (index: number) => void;
    };

export type RCustomSearchBoxComponentProps = CustomSearchBoxComponentProps & {
    loadData?: (index: number) => void;
};
