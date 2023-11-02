import React, { useState } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";

import {
    Avatar,
    Card,
    IconButton,
    Searchbar,
    TouchableRipple,
} from "react-native-paper";

import { useInfiniteHits } from "react-instantsearch-core";

import { colors } from "@feria-a-ti/common/theme/base";

import { SearchResultProps } from "@feria-a-ti/common/model/props/searchEngineProps";
import { IndexType } from "@feria-a-ti/common/model/indexTypes";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

export type SearchResultComponentProps = {
    canSubmit: boolean;
    onSubmit: (id: string, type: IndexType) => void;
};

const CustomSearchBoxComponent = (props: SearchResultComponentProps) => {
    const { canSubmit, onSubmit } = props;

    const { hits, isLastPage, showMore } = useInfiniteHits({
        ...props,
        escapeHTML: false,
    });

    return (
        <FlatList
            data={hits}
            keyExtractor={(item) => item.objectID}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={() => {
                if (!isLastPage) {
                    showMore();
                }
            }}
            renderItem={({ item }) => <Hit hit={item} onSubmit={onSubmit} />}
        />
    );
};

function Hit({ hit, onSubmit }) {
    const color = hit.rate > 0.1 ? colors.primary : colors.secondary;

    const colorShadow = hit.rate > 0.1 ? colors.light : colors.light;

    return (
        <TouchableRipple
            style={styles.item}
            onPress={() => {
                const mainId =
                    hit.type == IndexType.PRODUCT ? hit.vendorId : hit.id;
                onSubmit(mainId, hit.type);
            }}
        >
            <Card
                style={{
                    display: "flex",
                    width: "100%",
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    borderStyle: "solid",
                    borderColor: colorShadow,
                }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: color,
                        flexDirection: "column",
                    }}
                >
                    <Avatar.Image
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                        }}
                        source={{ uri: hit.image }}
                    />
                </View>
                <View style={{ flex: 5, flexDirection: "column" }}>
                    <Text>{hit.name}</Text>
                    <Text>{hit.description}</Text>
                </View>
                {hit.price != null && hit.price != undefined && (
                    <View style={{ flex: 1, flexDirection: "column" }}>
                        <Text>${numberWithCommas(hit.price)}</Text>
                    </View>
                )}
            </Card>
        </TouchableRipple>
    );
}

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

    separator: {
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    item: {
        padding: 10,
    },
});

export default CustomSearchBoxComponent;
