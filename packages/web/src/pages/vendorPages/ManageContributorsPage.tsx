import { useContext, useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";

import {
    addContributor,
    deleteContributor,
    updateContributor,
} from "@feria-a-ti/common/functions/contributorsFunctions";
import { getContributorList } from "@feria-a-ti/common/functions/listFunctions";
import {
    ContributorData,
    ContributorLevel,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import { UserRequestFields } from "@feria-a-ti/common/model/fields/fields";
import { RegisterContributorFields } from "@feria-a-ti/common/model/fields/registerFields";

import RegisterContributorForm from "@feria-a-ti/web/src/components/forms/registerContributorForm/RegisterContributorForm";
import ContributorList from "@feria-a-ti/web/src/components/contributorList/ContributorList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import "../../App.css";
import { UpdateContributorFields } from "@feria-a-ti/common/model/fields/updateFields";
import { DeleteFields } from "@feria-a-ti/common/model/fields/adminFields";
import { Navigate } from "react-router-dom";

function ManageContributorsPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    //Page stored data
    const [usersData, setUsersData] = useState<ContributorData[]>([]);
    const [selectedContributor, setSelectedContributor] =
        useState<ContributorData>();

    // Form related variables;

    const [isEditing, setIsEditing] = useState(false);
    const [updateContributorPage, setUpdateContributorPage] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);

    const onDeleteContributor = (id: string) => {
        const formatedData: DeleteFields = {
            email: emailUser as string,
            token: authToken as string,
            itemId: id,
        };

        deleteContributor({ formatedData, setCanSubmit }, (data) => {
            console.log(data);
            const { error: isError, msg, extra } = data;
            setMessage({ msg, isError });
            if (!isError) {
                const newData = usersData.filter((value) => value.id !== extra);
                setUsersData(newData);
            }
        });
    };

    const onEditContributor = (data: FieldValues) => {
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

        updateContributor({ formatedData, setCanSubmit }, (data) => {
            console.log(data);
            const { error: isError, msg, extra } = data;
            setMessage({ msg, isError });
            if (!isError) {
                const newData = usersData.concat([]);
                newData[newData.findIndex((value) => value.id === extra.id)] =
                    extra;
                setUsersData(newData);
                setUpdateContributorPage(false);
                setIsEditing(false);
                setSelectedContributor(undefined);
            }
        });
    };

    const onRegisterContributor = (data: FieldValues) => {
        const formatedData: RegisterContributorFields = {
            token: authToken as string,
            name: data.name.trim(),
            surname: data.surname.trim(),
            email: data.email,
            password: data.password,
            permission: data.permission || ContributorLevel.MANAGER,
        };

        console.log(formatedData);

        addContributor({ formatedData, setCanSubmit }, (data) => {
            console.log(data);
            const { error: isError, msg, extra } = data;

            setMessage({ msg, isError });
            if (!isError) {
                setUsersData(usersData.concat([extra]));
                setUpdateContributorPage(false);
                setIsEditing(false);
                setSelectedContributor(undefined);
            }
        });
    };

    const loadContributors = () => {
        const formatedData: UserRequestFields = {
            email: emailUser as string,
            token: authToken as string,
        };

        console.log(formatedData);

        getContributorList({ formatedData, setCanSubmit }, (data) => {
            const { error, msg, extra } = data;

            if (error) {
                setMessage({ msg, isError: error });
            } else {
                setUsersData(extra);
            }
        });
    };

    useEffect(() => {
        if (usersData.length == 0) {
            console.log("load contributors");
            loadContributors();
        }
    }, []);

    return (
        <>
            {type !== userType.vendor && type !== userType.contributor && (
                <Navigate to="/session" replace={true} />
            )}
            {updateContributorPage && (
                <>
                    <RegisterContributorForm
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
            )}
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
        </>
    );
}
export default ManageContributorsPage;
