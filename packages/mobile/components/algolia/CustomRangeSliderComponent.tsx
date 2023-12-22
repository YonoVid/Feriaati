import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Searchbar } from "react-native-paper";

import { useSearchBox } from "react-instantsearch";

import { colors } from "@feria-a-ti/common/theme/base";

import { useRange } from "react-instantsearch-core";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { CustomRangeSliderProps } from "@feria-a-ti/common/model/props/customSearchProps";

const CustomRangeSliderComponent = (props: CustomRangeSliderProps) => {
    const { label, color, children } = props;

    const {
        start,
        range,

        canRefine: canRefinePrice,
        refine: refinePrice,
    } = useRange(props);

    const { min, max } = range;
    const [localRange, setLocalRange] = useState<number[]>([
        min?.valueOf() || 0,
        max?.valueOf() || 1,
    ]);

    const [limitRange, setLimitRange] = useState<number[]>([
        min?.valueOf() || 0,
        max?.valueOf() || 1,
    ]);

    useEffect(() => {
        if (
            range != null &&
            range != undefined &&
            range.max != 0 &&
            limitRange[0] == 0 &&
            limitRange[1] == 1
        ) {
            console.log("PASÉ POR AHÍ::", range);
            setLimitRange([range.min, range.max]);
            if (
                start != null &&
                start != undefined &&
                localRange[0] == 0 &&
                localRange[1] == 1
            ) {
                console.log("ACTUARIZA EL RANGO::", start);
                setLocalRange([start[0].valueOf(), start[1].valueOf()]);
            }
        }
    }, [range, start]);

    return (
        <View
            style={{
                ...styles.container,
                paddingBottom: 80,
            }}
        >
            <MultiSlider
                values={localRange}
                min={limitRange[0]}
                max={limitRange[1]}
                step={100}
                enableLabel
                onValuesChange={(value) => {
                    setLocalRange(value);
                }}
                onValuesChangeFinish={() => {
                    canRefinePrice &&
                        refinePrice([localRange[0], localRange[1]]);
                }}
            />
        </View>
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
    container: {
        padding: 18,
        backgroundColor: "#ffffff",
    },
});

export default CustomRangeSliderComponent;
