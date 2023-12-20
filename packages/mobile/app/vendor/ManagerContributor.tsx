import React, { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import { colors } from "@feria-a-ti/common/theme/base";

import {
    addContributor,
    deleteContributor,
    updateContributor,
} from "@feria-a-ti/common/functions/vendor/contributorsFunctions";
import { getContributorList } from "@feria-a-ti/common/functions/vendor/contributorsFunctions";

import {
    ContributorData,
    ContributorLevel,
    YearFactureResumeCollection,
} from "@feria-a-ti/common/model/functionsTypes";
import { UserRequestFields } from "@feria-a-ti/common/model/fields/fields";
import { RegisterContributorFields } from "@feria-a-ti/common/model/fields/registerFields";
import { UpdateContributorFields } from "@feria-a-ti/common/model/fields/updateFields";
import { DeleteFields } from "@feria-a-ti/common/model/fields/adminFields";

import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";
import { ContributorList } from "../../components/contributorList/contributorList";
import ContributorAdd from "../../components/forms/ContributorAddForm";
import ContributorAddForm from "../../components/forms/ContributorAddForm";

export interface ManagerContributorProps {
    resumes?: Map<number, YearFactureResumeCollection>;
    setResumes?: (data: Map<number, YearFactureResumeCollection>) => void;
    navigation: NavigationProp<ParamListBase>;
}

export const ManagerContributor = (props: ManagerContributorProps) => {
    const { resumes, setResumes, navigation } = props;
    // Context variables
    const { authUser, emailUser, type, authToken, setMessage, resetProduct } =
        useAppContext();
    // UI variables
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    //Page stored data
    const [usersData, setUsersData] = useState<ContributorData[]>([]);
    const [selectedContributor, setSelectedContributor] =
        useState<ContributorData>();

    // Form related variables;

    const [isEditing, setIsEditing] = useState(false);
    const [updateContributorPage, setUpdateContributorPage] = useState(false);

    const loadContributors = () => {
        const formatedData: UserRequestFields = {
            email: emailUser as string,
            token: authToken as string,
        };

        console.log(formatedData);

        getContributorList(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                setUsersData(data);
            }
        );
    };

    const onRegisterContributor = (data: RegisterContributorFields) => {
        const formatedData: RegisterContributorFields = {
            token: authToken as string,
            name: data.name.trim(),
            surname: data.surname.trim(),
            email: emailUser,
            password: data.password,
            permission: data.permission || ContributorLevel.MANAGER,
        };

        console.log(formatedData);

        addContributor({ formatedData, setCanSubmit, setMessage }, (data) => {
            setUsersData(usersData.concat([data]));
            setUpdateContributorPage(false);
            setIsEditing(false);
            setSelectedContributor(undefined);
        });
    };

    const onEditContributor = (data: RegisterContributorFields) => {
        const formatedData: UpdateContributorFields = {
            email: emailUser as string,
            token: authToken as string,
            contributorId: selectedContributor?.id as string,
            name:
                data.name.trim() === selectedContributor?.name
                    ? undefined
                    : data.name.trim(),
            surname:
                data.surname.trim() === selectedContributor?.surname
                    ? undefined
                    : data.surname.trim(),
            password:
                data.password === selectedContributor?.password
                    ? undefined
                    : data.password,
            confirmPassword:
                data.password === selectedContributor?.password
                    ? undefined
                    : data.confirmPassword,
            permission:
                data.permission === selectedContributor?.permissions
                    ? undefined
                    : data.permission || ContributorLevel.MANAGER,
            productsId: selectedContributor?.productsId || "",
        };

        updateContributor(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                const newData = usersData.concat([]);
                newData[newData.findIndex((value) => value.id === data.id)] =
                    data;
                setUsersData(newData);
                setUpdateContributorPage(false);
                setIsEditing(false);
                setSelectedContributor(undefined);
            }
        );
    };

    const onDeleteContributor = (id: string) => {
        const formatedData: DeleteFields = {
            email: emailUser as string,
            token: authToken as string,
            itemId: id,
        };

        deleteContributor(
            { formatedData, setCanSubmit, setMessage },
            (data) => {
                const newData = usersData.filter((value) => value.id !== data);
                setUsersData(newData);
            }
        );
    };

    useEffect(() => {
        if (usersData.length == 0) {
            console.log("load contributors");
            loadContributors();
        }
    }, []);

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                {updateContributorPage ? (
                    <>
                        <ContributorAddForm
                            isEdit={isEditing}
                            contributor={selectedContributor}
                            canSubmit={canSubmit}
                            onSubmit={
                                isEditing
                                    ? onEditContributor
                                    : onRegisterContributor
                            }
                            onCancel={() => {
                                setUpdateContributorPage(false);
                                setIsEditing(false);
                                setSelectedContributor(undefined);
                            }}
                        />
                    </>
                ) : (
                    <ContributorList
                        contributors={usersData}
                        isAdding={updateContributorPage}
                        onAdd={() => setUpdateContributorPage(true)}
                        onEdit={(data) => {
                            setUpdateContributorPage(true);
                            setIsEditing(true);
                            setSelectedContributor(data);
                        }}
                        onDelete={onDeleteContributor}
                    />
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
