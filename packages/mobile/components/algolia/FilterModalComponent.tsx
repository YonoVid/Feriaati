import React, { useCallback, useState } from "react";
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
    useRefinementList,
} from "react-instantsearch-core";

import { colors } from "@feria-a-ti/common/theme/base";
import Slider from "@react-native-community/slider";

export function FilterModalComponent({ isModalOpen, onToggleModal, onChange }) {
    const { items, refine } = useRefinementList({ attribute: "price" });
    const {
        start,
        range,
        canRefine,
        refine: RefinePrice,
    } = useRange({ attribute: "price" });
    const { canRefine: canClear, refine: clear } = useClearRefinements();
    const { items: currentRefinements } = useCurrentRefinements();
    const totalRefinements = currentRefinements.reduce(
        (acc, { refinements }) => acc + refinements.length,
        0
    );

    const { min, max } = range;
    const [localRange, setLocalRange] = useState<number[]>([
        min?.valueOf() || 0,
        max?.valueOf() || 0,
    ]);

    const numberStartMin = start[0]?.valueOf() || 0;
    const numberStartMax = start[1]?.valueOf() || 0;

    const numberMin = min?.valueOf() || 0;
    const numberMax = max?.valueOf() || 0;

    const from = Math.max(
        numberMin,
        Number.isFinite(numberStartMin) ? numberStartMin : numberMin
    );
    const to = Math.min(
        numberMax,
        Number.isFinite(numberStartMax) ? numberStartMax : numberMax
    );

    return (
        <>
            <TouchableOpacity
                style={styles.filtersButton}
                onPress={onToggleModal}
            >
                <Text style={styles.filtersButtonText}>Filters</Text>
                {totalRefinements > 0 && (
                    <View style={styles.itemCount}>
                        <Text style={styles.itemCountText}>
                            {totalRefinements}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <Modal animationType="slide" visible={isModalOpen}>
                <SafeAreaView>
                    <View style={styles.container}>
                        <View style={styles.title}>
                            <Text style={styles.titleText}>Brand</Text>
                        </View>
                        <View style={styles.list}>
                            {items.map((item) => {
                                return (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={styles.item}
                                        onPress={() => {
                                            refine(item.value);
                                            onChange();
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...styles.labelText,
                                                fontWeight: item.isRefined
                                                    ? "800"
                                                    : "400",
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        <View style={styles.itemCount}>
                                            <Text style={styles.itemCountText}>
                                                {item.count}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                    <Slider></Slider>
                    <View style={styles.filterListButtonContainer}>
                        <View style={styles.filterListButton}>
                            <Button
                                title="Clear all"
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
                                title="See results"
                                color={colors.primaryShadow}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 18,
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
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    filtersButtonText: {
        fontSize: 18,
        textAlign: "center",
    },
});
