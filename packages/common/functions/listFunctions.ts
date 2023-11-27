import { httpsCallable } from "firebase/functions";
import { ContributorData, ResponseData } from "../model/functionsTypes";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import { UserRequestFields } from "../model/fields/fields";

export const getContributorList = async (
    data: {
        formatedData: UserRequestFields;
        setCanSubmit: (value: boolean) => void;
    },
    onSuccess: (data: ResponseData<string>) => void
) => {
    try {
        const { formatedData } = data;

        const users = httpsCallable<
            UserRequestFields,
            ResponseData<ContributorData[]>
        >(functions, "contributorList");
        users(formatedData).then((result) => {
            console.log(result.data);

            onSuccess(result.data as ResponseData<ContributorData[]>);
        });
    } catch (error) {
        console.error("Error al obtener los vendedores:", error);
    }
};
