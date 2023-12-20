import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { YearFactureResumeCollection } from "@feria-a-ti/common/model/functionsTypes";
import { colors } from "@feria-a-ti/common/theme/base";

import { ResumeFields } from "@feria-a-ti/common/model/fields/factureFields";

import { getResume } from "@feria-a-ti/common/functions/vendor/vendorFunctions";

import { DashboardComponent } from "@feria-a-ti/mobile/components/dashboard/DashboardComponent";
import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";

export interface DashboardVendorProps {
    resumes?: Map<number, YearFactureResumeCollection>;
    setResumes?: (data: Map<number, YearFactureResumeCollection>) => void;
    navigation: NavigationProp<ParamListBase>;
}

export const DashboardVendor = (props: DashboardVendorProps) => {
    const { resumes, setResumes, navigation } = props;
    // Context variables
    const { authUser, emailUser, type, authToken, setMessage, resetProduct } =
        useAppContext();
    // UI variables
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    // Retrived data
    const [localResumes, setLocalResumes] = useState<
        Map<number, YearFactureResumeCollection>
    >(new Map());

    const [date, setDate] = useState<Date>(new Date());

    const loadResume = (year: number) => {
        console.log("LOAD RESUME::", year);
        console.log("USER TYPE::", type);
        const formatedData: ResumeFields = {
            email: emailUser,
            token: authToken as string,
            year: year,
        };

        getResume({ formatedData, setCanSubmit, setMessage }, (data) => {
            console.log("IM SAVING THE RESUMES >:I");
            const newResumes = resumes;

            newResumes?.set(data.year, data);

            if (resumes && setResumes) {
                setResumes && setResumes(newResumes);
            } else {
                localResumes && setLocalResumes(newResumes);
            }
            setDate && setDate(new Date());
        });
    };

    useEffect(() => {
        if (resumes?.size < 1 && localResumes.size < 1) {
            loadResume(date.getFullYear());
        }
    }, []);

    return (
        <>
            <ScrollView
                style={styles.containerGlobal}
                contentContainerStyle={styles.innerContainer}
            >
                <Card style={styles.containerVendor}>
                    <Text style={{ ...styles.title, flex: 6 }}>
                        {"Resumen"}
                    </Text>
                    {resumes.size > 0 && (
                        <DashboardComponent
                            date={date}
                            resumes={resumes || localResumes}
                        />
                    )}
                </Card>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignContent: "center",
        textAlign: "center",
        padding: 8,
        margin: 20,
        paddingVertical: 20,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
    button: {
        marginTop: 35,
        alignContent: "center",
        color: colors.light,
        flexDirection: "row",
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
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    containerGlobal: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
    containerVendor: {
        flexGrow: 1,
        flex: 1,
        padding: 10,
        paddingBottom: 0,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
});
