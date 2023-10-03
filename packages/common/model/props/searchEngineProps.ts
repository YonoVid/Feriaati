import { IndexType, SearchIndex } from "../indexTypes";

export type SearchResultProps = {
    index: SearchIndex & { [key: string]: any };
    canSubmit: boolean;
    onSubmit: (id: string, type: IndexType) => void;
};
