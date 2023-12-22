import { httpsCallable } from "firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import {
    ResponseData,
    YearFactureResumeCollection,
} from "../../model/functionsTypes";
import { MessageData } from "../../model/sessionType";
import { ResumeFields } from "../../model/fields/factureFields";

export const getResume = (
    data: {
        formatedData: ResumeFields;
        setCanSubmit: (value: boolean) => void;
        setMessage: (value: MessageData) => void;
    },
    onSuccess: (data: YearFactureResumeCollection) => void
) => {
    const { formatedData, setCanSubmit, setMessage } = data;

    if (
        formatedData.token != undefined ||
        (formatedData.token != "" && formatedData.year != undefined) ||
        formatedData.year >= 1999
    ) {
        const getFactures = httpsCallable<
            ResumeFields,
            ResponseData<YearFactureResumeCollection>
        >(functions, "getResume");
        getFactures(formatedData).then((result) => {
            const { msg, error, extra } = result.data;
            console.log(result);

            setMessage({ msg, isError: error });

            if (!error && extra != null) {
                onSuccess(extra);
            }
        });
    }
};
