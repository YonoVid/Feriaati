import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { Card, IconButton, List } from "react-native-paper";

import { InstantSearch } from "react-instantsearch-core";
import algoliasearch from "algoliasearch/lite";

import { colors } from "@feria-a-ti/common/theme/base";

import { IndexType } from "@feria-a-ti/common/model/indexTypes";

import CustomSearchBoxComponent from "@feria-a-ti/mobile/components/algolia/CustomSearchBoxComponent";
import SearchResultComponent from "@feria-a-ti/mobile/components/algolia/SearchResultComponent";
import { FilterModalComponent } from "@feria-a-ti/mobile/components/algolia/FilterModalComponent";

import { useAppContext } from "../AppContext";

const searchClient = algoliasearch(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);

const searchIndex = "dev_feriaati";

export interface SearchProductsProps {
    navigation: NavigationProp<ParamListBase>;
}

export const SearchProducts = (props: SearchProductsProps) => {
    // Context variables
    const { authToken, setSession, setMessage, addProduct } = useAppContext();
    // Navigation
    const { navigation } = props;
    // Form variables
    const [isModalOpen, setModalOpen] = useState(false);
    const [canSubmit, setSubmitActive] = useState(true);

    const [open, setOpen] = useState(true);

    const handleDrawerState = (state = false) => {
        setOpen(state);
    };

    const onClick = async (id: string, type: IndexType) => {
        setSubmitActive(false);
        console.log("GO TO SEARCH ITEM::", id, type);
        navigation.navigate("vendorProducts", { vendorId: id });
    };

    return (
        <>
            <Card
                style={{
                    backgroundColor: colors.light,
                    maxWidth: "100%",
                    alignContent: "center",
                    paddingBottom: "20%",
                }}
            >
                <InstantSearch
                    indexName={searchIndex}
                    searchClient={searchClient}
                    future={{
                        preserveSharedStateOnUnmount: true,
                    }}
                >
                    <CustomSearchBoxComponent />
                    <FilterModalComponent
                        isModalOpen={isModalOpen}
                        onToggleModal={() => setModalOpen((isOpen) => !isOpen)}
                        onChange={() => false} //scrollToTop
                    />
                    <SearchResultComponent
                        canSubmit={canSubmit}
                        onSubmit={onClick}
                    />
                </InstantSearch>
            </Card>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        padding: 8,
        margin: 20,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
    button: {
        marginTop: 35,
        alignContent: "center",
        color: colors.light,
        flexDirection: "row",
        height: 40,
        backgroundColor: colors.secondaryShadow,
        borderRadius: 20,
    },
    buttonInner: {
        margin: 40,
        color: colors.primaryShadow,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    title: {
        marginVertical: 20,
        textAlign: "center",
        color: colors.primaryShadow,
        fontSize: 30,
        fontWeight: "bold",
        borderRadius: 4,
    },
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    containerGlobal: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
