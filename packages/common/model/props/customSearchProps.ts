import { FormProps } from "react-router-dom";
import type { SearchBoxConnectorParams } from "instantsearch.js/es/connectors/search-box/connectSearchBox";
import type { MenuItem } from "instantsearch.js/es/connectors/menu/connectMenu";
import type {
    RangeBoundaries,
    Range,
} from "instantsearch.js/es/connectors/range/connectRange";

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

export type CustomRangeSliderProps = FormProps & {
    start: RangeBoundaries;
    range: Range;
    canRefine: boolean;
    refine: (rangeValue: RangeBoundaries) => void;
};

export type CustomMenuSelectProps = FormProps & {
    items: MenuItem[];
    refine: (value: string) => void;
};
