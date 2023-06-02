import { ProductFields } from "@feria-a-ti/common/model/productAddFormProps";

export const checkAddProductFields = (input: ProductFields): boolean => {
  const { name, price, discount, promotion, image } = input;

  const productCheck =
    name != null &&
    price != null &&
    discount != null &&
    promotion != null &&
    image != null;

  return productCheck;
};
