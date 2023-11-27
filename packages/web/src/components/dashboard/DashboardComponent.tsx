import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { DashboardComponentProps } from "@feria-a-ti/common/model/props/dashboardComponentProps";
import { YearFactureResumeCollection } from "@feria-a-ti/common/model/functionsTypes";
import { useEffect, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { numberWithCommas } from "@feria-a-ti/common/helpers";

type ChartData = Array<{
    name: string;
    transactions: number;
    subtotal: number;
}>;

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

function DashboardComponent(props: DashboardComponentProps) {
    const { date, resumes } = props;

    const [activeResume, setActiveResume] =
        useState<YearFactureResumeCollection>();
    const [activeYear, setActiveYear] = useState<number>();
    const [chartData, setChartData] = useState<ChartData>();

    const loadResumeData = (data: YearFactureResumeCollection) => {
        const newChartData: ChartData = [];
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
            newChartData.push({
                name: monthName[index + i],
                transactions: monthData.transactions,
                subtotal: monthData.totalIncome,
            });
            if (index + i + 1 > 11) {
                index -= 12;
            }
        }
        setChartData(newChartData);
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
    }, []);

    return (
        <Card
            className="inputContainer"
            sx={{
                maxWidth: "80%",
                alignContent: "center",
                borderRadius: "10%",
            }}
        >
            <CardHeader
                title={
                    "Resumen anual " +
                    activeYear +
                    " (" +
                    date.toLocaleDateString() +
                    ")"
                }
            />

            <CardContent>
                {activeResume && (
                    <>
                        <Typography
                            sx={{ fontSize: 18 }}
                            color="text.primary"
                            gutterBottom
                        >
                            Ganancias anuales: $
                            {numberWithCommas(activeResume.totalIncome)}
                        </Typography>
                        <Typography
                            sx={{ fontSize: 18 }}
                            color="text.primary"
                            gutterBottom
                        >
                            Ventas anuales:{" "}
                            {numberWithCommas(activeResume.transactions)}
                        </Typography>
                    </>
                )}
                <Box
                    sx={{
                        minWidth: "100%",
                        minHeight: "30%",
                        justifyContent: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                        alignContent: "center",
                        justifyItems: "center",
                        display: "flex",
                    }}
                >
                    <LineChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            type="category"
                            height={100}
                            angle={-60}
                            textAnchor="end"
                            interval={0}
                        />
                        <YAxis yAxisId={"subtotal"} />
                        <YAxis yAxisId={"transactions"} allowDecimals={false} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="transactions"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            yAxisId={"transactions"}
                        />
                        <Line
                            type="monotone"
                            dataKey="subtotal"
                            stroke="#82ca9d"
                            yAxisId={"subtotal"}
                        />
                    </LineChart>
                </Box>
            </CardContent>
        </Card>
    );
}

export default DashboardComponent;
