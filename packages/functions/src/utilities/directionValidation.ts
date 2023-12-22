// const address = {}
/**
 *  This field must be empty for the first address validation request. If
 *  more requests are necessary to fully validate a single address (for
 *  example if the changes the user makes after the initial validation need to
 *  be re-validated), then each followup request must populate this field with
 *  the
 *  response_id google.maps.addressvalidation.v1.ValidateAddressResponse.response_id
 *  from the very first response in the validation sequence.
// const previousResponseId = 'abc123'
**/
import * as functions from "firebase-functions";
// Imports the Addressvalidation library
import { AddressValidationClient, protos } from "@googlemaps/addressvalidation";
import { AccountDirection } from "../model/accountTypes";
import { regionCode, regionCommune } from "../model/form";

// Instantiates a client
const addressvalidationClient = new AddressValidationClient();

export const validateAddress = async (
    direction: AccountDirection
): Promise<boolean> => {
    let promise = false;
    const regionArray = regionCode.find(
        (value) => value[0] === direction.region
    );
    const communeArray = regionCommune[direction.region].find(
        (value) => value[0] === direction.commune
    );

    if (regionArray && communeArray) {
        // Construct request
        const request: protos.google.maps.addressvalidation.v1.IValidateAddressRequest =
            {
                address: {
                    regionCode: "CL",
                    administrativeArea: regionArray[1],
                    locality: communeArray[1],
                    addressLines: [
                        direction.street + " " + direction.streetNumber,
                    ],
                },
            };

        // Run request
        const response = await addressvalidationClient.validateAddress(request);
        if (response && response != null) {
            functions.logger.info(JSON.stringify(response));
            const basicResponse = response[0].result?.verdict;
            const addressResponse = response[0].result?.address;
            if (
                basicResponse?.addressComplete &&
                !basicResponse?.hasUnconfirmedComponents
            ) {
                functions.logger.info(JSON.stringify(basicResponse));
                promise = true;
            } else if (
                addressResponse != undefined &&
                addressResponse != null &&
                addressResponse?.addressComponents != undefined &&
                addressResponse?.addressComponents != null
            ) {
                functions.logger.info(JSON.stringify(addressResponse));
                promise = true;
                for (const value of addressResponse.addressComponents) {
                    if (
                        value.confirmationLevel === "UNCONFIRMED_AND_SUSPICIOUS"
                    ) {
                        promise = false;
                        break;
                    }
                }
            }
        }
    }

    return promise;
};
