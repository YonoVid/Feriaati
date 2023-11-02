import "react-native-get-random-values";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import {
    FactureData,
    YearFactureResumeCollection,
} from "@feria-a-ti/common/model/functionsTypes";

import { Button, Card, DataTable, TouchableRipple } from "react-native-paper";
import { useAppContext } from "../../app/AppContext";
import { colors } from "@feria-a-ti/common/theme/base";
import CommentForm from "../forms/CommentForm";
import { RFacturesListProps } from "@feria-a-ti/common/model/props/facturesListProps";
import { DashboardComponentProps } from "@feria-a-ti/common/model/props/dashboardComponentProps";
import { LineChart } from "react-native-chart-kit";

const monthName = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
];

export const DashboardComponent = (props: DashboardComponentProps) => {
    const { date, resumes } = props;

    const [activeResume, setActiveResume] =
        useState<YearFactureResumeCollection>();
    const [activeYear, setActiveYear] = useState<number>();
    const [chartData, setChartData] = useState<number[]>([]);
    const [chartLabel, setChartLabel] = useState<string[]>([]);

    const loadResumeData = (data: YearFactureResumeCollection) => {
        const newChartData: number[] = [];
        const newChartLabel: string[] = [];
        let index = date.getMonth() > 11 ? 0 : date.getMonth() + 1;

        for (let i = 0; i < 12; i++) {
            let monthData = data.month[index + i];

            if (monthData == null || monthData == undefined) {
                monthData = {
                    products: {},
                    totalIncome: 0,
                    transactions: 0,
                };
            }
            newChartData.push(monthData.totalIncome);
            newChartLabel.push(monthName[index + i]);

            if (index + i + 1 > 11) {
                index -= 12;
            }
        }
        setChartData(newChartData);
        setChartLabel(newChartLabel);
        console.log("CHART DATA::", newChartData);

        setActiveResume(data);
    };

    useEffect(() => {
        if (resumes != null && resumes.size > 0) {
            if (date != undefined && date != null) {
                setActiveYear(date.getFullYear());
                const newResume = resumes.get(date.getFullYear());

                if (newResume != undefined && newResume != null) {
                    loadResumeData(newResume);
                }
            }
        }
    }, [resumes]);

    return (
        <View style={styles.container}>
            {activeResume != null &&
                activeResume != undefined &&
                chartData.length > 0 &&
                chartLabel.length > 0 && (
                    <LineChart
                        data={{
                            labels: chartLabel,
                            datasets: [
                                {
                                    data: chartData,
                                },
                            ],
                        }}
                        verticalLabelRotation={60}
                        width={Dimensions.get("window").width * 0.9} // from react-native
                        height={Dimensions.get("window").height * 0.55}
                        yAxisLabel="$"
                        yAxisInterval={1} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: colors.secondaryShadow,
                            backgroundGradientFrom: colors.primaryShadow,
                            backgroundGradientTo: colors.primary,
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            labelColor: (opacity = 1) =>
                                `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: colors.secondary,
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        paddingTop: 0,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
    button: {
        marginTop: 35,
        alignContent: "center",
        color: colors.light,
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
});
