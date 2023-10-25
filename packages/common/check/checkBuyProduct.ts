import { ProductFactureFields } from "../model/fields/buyingFields";
import { AccountDirection } from "../model/functionsTypes";

export const checkBuyProduct = (input: ProductFactureFields): boolean => {
    const { token, direction, products } = input;

    //Check required values exist
    const requiredCheck =
        token != null &&
        token != "" &&
        (products != null || Object.keys(products).length > 0);

    const directionCheck =
        direction == undefined || direction == null
            ? true
            : direction != undefined && checkDirection(direction);

    return requiredCheck && directionCheck;
};

export const checkDirection = (data: AccountDirection) => {
    return (
        data.commune != null &&
        !isNaN(data.commune) &&
        data.region != null &&
        !isNaN(data.region) &&
        data.street != null &&
        data.streetNumber != null &&
        !isNaN(data.streetNumber)
    );
};
