import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Stack,
    Typography,
} from "@mui/material";
import { DashboardComponentProps } from "@feria-a-ti/common/model/props/dashboardComponentProps";
import {
    FactureResumeCollection,
    YearFactureResumeCollection,
} from "@feria-a-ti/common/model/functionsTypes";
import { useEffect, useState } from "react";

function DashboardComponent(props: DashboardComponentProps) {
    const { date, resumes } = props;

    const [activeResume, setActiveResume] =
        useState<YearFactureResumeCollection>();
    const [activeYear, setActiveYear] = useState<number>();

    useEffect(() => {
        ("RESUMES EXISTS");
        if (resumes != null && resumes.size > 0) {
            if (date != undefined && date != null) {
                setActiveYear(date.getFullYear());
                const newResume = resumes.get(activeYear as number);

                if (newResume != undefined && newResume != null) {
                    setActiveResume(newResume);
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
            <CardHeader title={"Resumen anual " + activeYear}>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.primary"
                    gutterBottom
                >
                    {date.toLocaleDateString()}
                </Typography>
                {activeResume && (
                    <>
                        <Typography
                            sx={{ fontSize: 18 }}
                            color="text.primary"
                            gutterBottom
                        >
                            Ganancias anuales {activeResume.totalIncome}
                        </Typography>
                        <Typography
                            sx={{ fontSize: 18 }}
                            color="text.primary"
                            gutterBottom
                        >
                            Ventas anuales {activeResume.transactions}
                        </Typography>
                    </>
                )}
            </CardHeader>
            <Stack
                direction={{ xs: "column" }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
                sx={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    justifyContent: "center",
                    alignContent: "center",
                }}
            >
                {activeResume &&
                    Object.values(activeResume.month).map((resume, index) => (
                        <Card key={index}>
                            <CardHeader title="Resumen mensual">
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.primary"
                                    gutterBottom
                                >
                                    Ganancias anuales {resume.totalIncome}
                                </Typography>
                                <Typography
                                    sx={{ fontSize: 18 }}
                                    color="text.primary"
                                    gutterBottom
                                >
                                    Ventas anuales {resume.transactions}
                                </Typography>
                            </CardHeader>
                            {Object.values(resume.products).map(
                                (product, index) => (
                                    <Card key={index}>
                                        <CardHeader
                                            title={"Resumen " + product.name}
                                        >
                                            <Typography
                                                sx={{ fontSize: 18 }}
                                                color="text.primary"
                                                gutterBottom
                                            >
                                                Ganancias mensuales{" "}
                                                {product.subtotal}
                                            </Typography>
                                            <Typography
                                                sx={{ fontSize: 18 }}
                                                color="text.primary"
                                                gutterBottom
                                            >
                                                Cantidad vendida{" "}
                                                {product.quantity}
                                            </Typography>
                                        </CardHeader>
                                    </Card>
                                )
                            )}
                        </Card>
                    ))}
            </Stack>
        </Card>
    );
}

export default DashboardComponent;
