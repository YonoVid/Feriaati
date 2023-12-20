import React from "react";
import {
    Button,
    StyleSheet,
    SafeAreaView,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    useClearRefinements,
    useCurrentRefinements,
    useRange,
    useMenu,
    useRefinementList,
} from "react-instantsearch-core";

import { colors } from "@feria-a-ti/common/theme/base";
import { indexName, IndexType } from "@feria-a-ti/common/model/indexTypes";
import CustomRangeSliderComponent from "./CustomRangeSliderComponent";
import CustomMenuSelectComponent from "./CustomMenuSelectComponent";
import { ScrollView } from "react-native-gesture-handler";
import { Provider } from "react-native-paper";

export function FilterModalComponent({ isModalOpen, onToggleModal, onChange }) {
    const { items, refine: refineType } = useRefinementList({
        attribute: "type",
    });
    const { canRefine: canClearType, refine: clearType } = useClearRefinements({
        includedAttributes: ["type"],
    });
    const {
        start,
        range,

        canRefine: canRefinePrice,
        refine: refinePrice,
    } = useRange({ attribute: "price" });

    const { items: itemsRegion, refine: refineRegion } = useMenu({
        attribute: "region",
    });

    const { items: itemsCommune, refine: refineCommune } = useMenu({
        attribute: "commune",
    });

    const { canRefine: canClear, refine: clear } = useClearRefinements();
    const { items: currentRefinements } = useCurrentRefinements();
    const totalRefinements = currentRefinements.reduce(
        (acc, { refinements }) => acc + refinements.length,
        0
    );

    return (
        <>
            <TouchableOpacity
                style={styles.filtersButton}
                onPress={onToggleModal}
            >
                <Text style={styles.filtersButtonText}>Filtros</Text>
                {totalRefinements > 0 && (
                    <View style={styles.itemCount}>
                        <Text style={styles.itemCountText}>
                            {totalRefinements}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <Modal animationType="slide" visible={isModalOpen}>
                <Provider>
                    <SafeAreaView style={{ paddingBottom: 8 }}>
                        <ScrollView>
                            <View style={styles.container}>
                                <View style={styles.title}>
                                    <Text style={styles.titleText}>Tipo</Text>
                                </View>
                                <View style={styles.list}>
                                    {items.map((item) => {
                                        return (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={styles.item}
                                                onPress={() => {
                                                    clearType();
                                                    refineType(item.value);
                                                    onChange();
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        ...styles.labelText,
                                                        fontWeight:
                                                            item.isRefined
                                                                ? "800"
                                                                : "400",
                                                    }}
                                                >
                                                    {Object.keys(
                                                        IndexType
                                                    ).includes(item.value) &&
                                                    !isNaN(+item.value)
                                                        ? indexName[
                                                              +item.value as IndexType
                                                          ]
                                                        : item.value}
                                                </Text>
                                                <View style={styles.itemCount}>
                                                    <Text
                                                        style={
                                                            styles.itemCountText
                                                        }
                                                    >
                                                        {item.count}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    <TouchableOpacity
                                        key={"all"}
                                        style={styles.item}
                                        onPress={() => {
                                            clearType();
                                            onChange();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.labelText,
                                                fontWeight:
                                                    items.findIndex(
                                                        (value) =>
                                                            value.isRefined
                                                    ) == -1
                                                        ? "800"
                                                        : "400",
                                            }}
                                        >
                                            {"Todo"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>
                                    Rango de precio
                                </Text>
                            </View>
                            <View
                                style={{
                                    ...styles.container,
                                    marginTop: 0,
                                }}
                            >
                                <CustomRangeSliderComponent
                                    start={start}
                                    range={range}
                                    canRefine={canRefinePrice}
                                    refine={refinePrice}
                                />
                            </View>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>
                                    Selección región
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <CustomMenuSelectComponent
                                    items={itemsRegion}
                                    refine={refineRegion}
                                    type={"region"}
                                />
                            </View>
                            <View style={styles.title}>
                                <Text style={styles.titleText}>
                                    Selección comuna
                                </Text>
                            </View>
                            <View style={styles.container}>
                                <CustomMenuSelectComponent
                                    items={itemsCommune}
                                    refine={refineCommune}
                                    type={"commune"}
                                />
                            </View>
                            <View style={styles.filterListButtonContainer}>
                                <View style={styles.filterListButton}>
                                    <Button
                                        title="Eliminar filtros"
                                        color={colors.secondaryShadow}
                                        disabled={!canClear}
                                        onPress={() => {
                                            clear();
                                            onChange();
                                            onToggleModal();
                                        }}
                                    />
                                </View>
                                <View style={styles.filterListButton}>
                                    <Button
                                        onPress={onToggleModal}
                                        title="Volver"
                                        color={colors.primaryShadow}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                </Provider>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
        backgroundColor: "#ffffff",
    },
    containerFilter: {
        padding: 18,
        marginTop: 3,
        backgroundColor: "#ffffff",
    },
    title: {
        alignItems: "center",
    },
    titleText: {
        fontSize: 32,
    },
    list: {
        marginTop: 32,
    },
    item: {
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    itemCount: {
        backgroundColor: "#252b33",
        borderRadius: 24,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginLeft: 4,
    },
    itemCountText: {
        color: "#ffffff",
        fontWeight: "800",
    },
    labelText: {
        fontSize: 16,
    },
    filterListButtonContainer: {
        flexDirection: "row",
    },
    filterListButton: {
        flex: 1,
        alignItems: "center",
        marginTop: 18,
    },
    filtersButton: {
        paddingVertical: 18,
        backgroundColor: colors.secondary,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    filtersButtonText: {
        fontSize: 18,
        textAlign: "center",
    },
});
