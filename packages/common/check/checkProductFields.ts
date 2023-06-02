import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";
// import { numberRegex } from "./checkRegisterFields";

export const checkAddProductFields = (input: ProductFields): boolean => {
    const { name, description, price, discount, promotion, image } = input;
    //Check required values exist
    const requiredCheck =
        name != null && description != null && price != null && image != null;
    console.log("Required check", requiredCheck);

    const discountCheck =
        discount === "none" || (discount != null && promotion != null);
    console.log("Discount check", requiredCheck);

    // console.log("Username check", userCheck);
    return requiredCheck && discountCheck;
};
