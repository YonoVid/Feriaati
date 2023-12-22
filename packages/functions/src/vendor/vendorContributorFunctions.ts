import * as functions from "firebase-functions";

import { ContributorData } from "../model/accountTypes";
import { ResponseData } from "../model/reponseFields";
import { UserRequestFields } from "../model/types";

import { getContributorList } from "../utilities/getList";

import { errorCodes } from "../errors";

export const contributorList = functions.https.onCall(
    async (
        data: UserRequestFields
    ): Promise<ResponseData<ContributorData[]>> => {
        try {
            return await getContributorList(
                data.token as string,
                data.email as string,
                errorCodes.VENDOR_NOT_EXISTS_ERROR
            );
        } catch (error) {
            functions.logger.error(error);
            throw new functions.https.HttpsError(
                "internal",
                "Error al obtener datos de los vendedores"
            );
        }
    }
);
