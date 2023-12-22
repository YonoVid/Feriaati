import React, { useState } from "react";
import { StyleSheet } from "react-native";

import { Searchbar } from "react-native-paper";

import { useSearchBox } from "react-instantsearch";

import { colors } from "@feria-a-ti/common/theme/base";

import { CustomSearchBoxComponentProps } from "@feria-a-ti/common/model/props/customSearchProps";

const CustomSearchBoxComponent = (props: CustomSearchBoxComponentProps) => {
    const { label, color, children, filter, filterMenu } = props;

    const colorTheme =
        color != null && color === "secondary" ? "secondary" : "primary";

    const { query, refine, clear } = useSearchBox(props);

    const [inputValue, setInputValue] = useState(query);
    const [filterVendor, setFilterVendor] = useState<string | null>();

    const setQuery = (newQuery: string) => {
        setInputValue(newQuery);

        refine(newQuery);
    };

    return (
        <>
            <Searchbar
                placeholder="Buscar..."
                onChangeText={setQuery}
                value={inputValue}
            />
        </>
    );
};

const styles = StyleSheet.create({
    labelWrapper: {
        alignItems: "center",
        marginTop: "-2%",
        flexDirection: "row",
    },
    label: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        alignSelf: "flex-start",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 15,
        paddingHorizontal: "5%",
        borderRadius: 10,
    },
    input: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        marginTop: "2%",
        height: 40,
        marginHorizontal: 0,
        borderRadius: 50,
    },
});

export default CustomSearchBoxComponent;
