import * as functions from "firebase-functions";
import { ContributorData } from "../model/accountTypes";
import { getContributorList } from "../utilities/getList";
import { collectionNames } from "../consts";
import { ResponseData } from "../model/reponseFields";
import { errorCodes } from "../errors";
import { UserRequestFields } from "../model/types";

export const contributorList = functions.https.onCall(
    async (
        data: UserRequestFields
    ): Promise<ResponseData<ContributorData[]>> => {
        try {
            return await getContributorList(
                data.token as string,
                collectionNames.VENDORS,
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
