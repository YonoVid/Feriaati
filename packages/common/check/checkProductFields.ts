import { ProductFields } from "../model/productAddFormProps";

export const checkAddProductFields = (input: ProductFields): boolean => {
  const { name, price, isPercentage, promotion, image } = input;

  const productCheck =
    name != null &&
    price != null &&
    isPercentage != null &&
    promotion != null &&
    image != null;

  return productCheck;
};
