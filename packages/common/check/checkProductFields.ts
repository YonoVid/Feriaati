import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";

export const checkAddProductFields = (input: ProductFields): boolean => {
    const { name, description, price, isPercentage, promotion, image } = input;
    //Check required values exist
    const requiredCheck =
        name != null &&
        description != null &&
        price != null &&
        isPercentage != null &&
        promotion != null &&
        image != null;

    // console.log("Username check", userCheck);
    return requiredCheck;
};
