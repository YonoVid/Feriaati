import {
    ProductDeleteFields,
    ProductFields,
} from "@feria-a-ti/common/model/props/productAddFormProps";
import { ProductUnit } from "../model/functionsTypes";
import { numberRegex } from "./checkBase";
// import { numberRegex } from "./checkRegisterFields";

export const checkAddProductFields = (input: ProductFields): boolean => {
    const {
        name,
        description,
        price,
        discount,
        promotion,
        image,
        unitType,
        unit,
    } = input;
    //Check required values exist
    const requiredCheck =
        name != null &&
        description != null &&
        price != null &&
        image != null &&
        unitType != null;
    console.log("Required check", requiredCheck);

    const priceCheck =
        price == null ||
        price == undefined ||
        !isNaN(price) ||
        (price > 0 && numberRegex.test(price.toString()));
    console.log("Price check::%d = %b", price, priceCheck);

    const unitCheck =
        unitType !== ProductUnit.GRAM ||
        (unit != undefined && unit != null && (unit as number) > 0);

    const discountCheck =
        discount === "none" ||
        (discount != null &&
            promotion != null &&
            !isNaN(price) &&
            (promotion as number) > 0 &&
            ((discount === "percentage" && promotion <= 100) ||
                (discount === "value" && (promotion as number) <= price)));
    console.log("Discount check", requiredCheck);

    // console.log("Username check", userCheck);
    return requiredCheck && priceCheck && discountCheck && unitCheck;
};

export const checkDeleteProductFields = (
    input: ProductDeleteFields
): boolean => {
    const { tokenVendor, idVendor, productId } = input;
    //Check required values exist
    const requiredCheck =
        ((tokenVendor != null && tokenVendor != "") ||
            (idVendor != "" && idVendor != null)) &&
        productId != "" &&
        productId != "";
    console.log("Required check", requiredCheck);

    // console.log("Username check", userCheck);
    return requiredCheck;
};
