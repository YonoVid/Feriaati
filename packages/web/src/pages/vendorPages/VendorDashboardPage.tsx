import { useEffect, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";
import {
    ResponseData,
    userType,
    YearFactureResumeCollection,
} from "@feria-a-ti/common/model/functionsTypes";
import { ResumeFields } from "@feria-a-ti/common/model/fields/factureFields";

import DashboardComponent from "@feria-a-ti/web/src/components/dashboard/DashboardComponent";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

function VendorDashboardPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authUser, authToken, emailUser, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
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
        if (authUser != undefined || authUser != "") {
            const getFactures = httpsCallable(functions, "getResume");
            getFactures(formatedData).then((result) => {
                const { msg, error, extra } =
                    result.data as ResponseData<YearFactureResumeCollection>;
                console.log(result);
                //setIsLogged(result.data as any);
                setMessage({ msg, isError: error });
                if (!error && extra != null) {
                    console.log("IM SAVING THE RESUMES >:I");
                    const newResumes = resumes;

                    newResumes?.set(extra.year, extra);

                    setResumes && setResumes(newResumes);
                    setDate && setDate(new Date());
                }
            });
        }
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
            {date != null && resumes.size > 0 && (
                <DashboardComponent date={date} resumes={resumes} />
            )}
        </>
    );
}
export default VendorDashboardPage;
