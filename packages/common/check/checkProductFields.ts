import {
    ProductDeleteFields,
    ProductFields,
} from "@feria-a-ti/common/model/productAddFormProps";
import { numberRegex } from "./checkRegisterFields";
// import { numberRegex } from "./checkRegisterFields";

export const checkAddProductFields = (input: ProductFields): boolean => {
    const { name, description, price, discount, promotion, image } = input;
    //Check required values exist
    const requiredCheck =
        name != null && description != null && price != null && image != null;
    console.log("Required check", requiredCheck);

    const priceCheck =
        price === null ||
        price == undefined ||
        (price !== 0 && numberRegex.test(price.toString()));
    console.log("Price check::%d = %b", price, priceCheck);

    const discountCheck =
        discount === "none" ||
        (discount != null &&
            promotion != null &&
            (promotion as number) > 0 &&
            ((discount === "percentage" && promotion <= 100) ||
                (discount === "value" && (promotion as number) <= price)));
    console.log("Discount check", requiredCheck);

    // console.log("Username check", userCheck);
    return requiredCheck && priceCheck && discountCheck;
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
