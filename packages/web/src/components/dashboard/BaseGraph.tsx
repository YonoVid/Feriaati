import React from "react";
import { Box } from "@mui/material";
import {
    CartesianGrid,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
    { name: "Page A", subtotal: 4000, transactions: 2400 },
    { name: "Page B", subtotal: 3000, transactions: 1398 },
    { name: "Page C", subtotal: 2000, transactions: 9800 },
    { name: "Page D", subtotal: 2780, transactions: 3908 },
    { name: "Page E", subtotal: 1890, transactions: 4800 },
    { name: "Page F", subtotal: 2390, transactions: 3800 },
    { name: "Page G", subtotal: 3490, transactions: 4300 },
];

type ChartData = Array<{
    name: string;
    transactions: number;
    subtotal: number;
}>;

function SimpleAreaChart(props: ChartData) {
    return (
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
                data={props || data}
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
    );
}
