import { useEffect, useContext, useState } from "react";
import { Navigate } from "react-router-dom";

import LoadingOverlay from "react-loading-overlay-ts";

import { Card, CardContent, CardHeader } from "@mui/material";

import {
    userType,
    YearFactureResumeCollection,
} from "@feria-a-ti/common/model/functionsTypes";
import { ResumeFields } from "@feria-a-ti/common/model/fields/factureFields";

import { getResume } from "@feria-a-ti/common/functions/vendor/vendorFunctions";

import DashboardComponent from "@feria-a-ti/web/src/components/dashboard/DashboardComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "@feria-a-ti/web/src/pages/HeaderFunction";
import "@feria-a-ti/web/src/App.css";

function VendorDashboardPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);
    //Navigation definition
    const [canSubmit, setCanSubmit] = useState<boolean>(true);
    // Retrived data
    const [resumes, setResumes] = useState<
        Map<number, YearFactureResumeCollection>
    >(new Map());

    const [date, setDate] = useState<Date>(new Date());

    const loadResume = (year: number) => {
        console.log("LOAD RESUME::", year);
        console.log("USER TYPE::", type);
        const formatedData: ResumeFields = {
            email: emailUser as string,
            token: authToken as string,
            year: year,
        };

        getResume({ formatedData, setCanSubmit, setMessage }, (data) => {
            console.log("IM SAVING THE RESUMES >:I");
            const newResumes = resumes;

            newResumes?.set(data.year, data);

            setResumes && setResumes(newResumes);
            setDate && setDate(new Date());
        });
    };

    useEffect(() => {
        if (resumes?.size < 1) {
            loadResume(date.getFullYear());
        }
    }, []);

    return (
        <>
            {type !== userType.vendor && type !== userType.contributor && (
                <Navigate to="/session" replace={true} />
            )}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Realizando petición..."
            >
                {date != null && resumes.size > 0 ? (
                    <DashboardComponent date={date} resumes={resumes} />
                ) : (
                    <Card
                        className="inputContainer"
                        sx={{
                            maxWidth: "80%",
                            alignContent: "center",
                            borderRadius: "10%",
                        }}
                    >
                        <CardHeader title={"No hay datos registrados"} />

                        <CardContent>
                            <p>
                                Se deben tener ventas registradas en el sistema
                                para generar información relevante del negocio.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </LoadingOverlay>
        </>
    );
}
export default VendorDashboardPage;
